import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/common/utils/password";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/common/utils/tokens";
import { ConflictError, UnauthorizedError } from "@/common/errors/AppError";
import { LoginInput, RegisterInput } from "@/modules/auth/auth.validation";
import { recordAuditLog } from "@/modules/audit/audit.service";
import crypto from "crypto";

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function issueTokenPair(user: { id: string; email: string; role: "SUPER_ADMIN" | "SALES_STAFF" }) {
  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
}

export async function registerUser(input: RegisterInput, actorId?: string) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new ConflictError("A user with this email already exists");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, passwordHash, role: input.role },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
  });

  await recordAuditLog({
    userId: actorId ?? user.id,
    action: "CREATE",
    module: "users",
    recordId: user.id,
    newValues: user,
  });

  return user;
}

export async function loginUser(input: LoginInput, ipAddress?: string) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  const passwordMatches = user ? await verifyPassword(user.passwordHash, input.password) : false;

  await prisma.loginLog.create({
    data: { userId: user?.id, email: input.email, success: !!passwordMatches, ipAddress },
  });

  if (!user || !passwordMatches) {
    throw new UnauthorizedError("Invalid email or password");
  }

  if (user.status !== "ACTIVE") {
    throw new UnauthorizedError("Your account is not active. Contact your administrator.");
  }

  const tokens = await issueTokenPair(user);
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    ...tokens,
  };
}

export async function refreshTokens(refreshToken: string) {
  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }

  const tokenHash = hashToken(refreshToken);
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!stored || stored.revoked || stored.expiresAt < new Date()) {
    throw new UnauthorizedError("Refresh token has been revoked or expired");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || user.status !== "ACTIVE") {
    throw new UnauthorizedError("Account no longer active");
  }

  // Rotate: revoke the used refresh token, issue a brand new pair
  await prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true } });
  const tokens = await issueTokenPair(user);

  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens };
}

export async function logoutUser(refreshToken: string) {
  const tokenHash = hashToken(refreshToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { revoked: true },
  });
}
