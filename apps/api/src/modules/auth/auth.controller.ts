import { Request, Response } from "express";
import { ApiResponse } from "@/common/utils/ApiResponse";
import * as authService from "@/modules/auth/auth.service";
import { BadRequestError } from "@/common/errors/AppError";

const REFRESH_COOKIE = "refreshToken";
const isCookieSecure = process.env.NODE_ENV === "production";

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: isCookieSecure,
    sameSite: "strict",
    path: "/api/v1/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export async function register(req: Request, res: Response) {
  const user = await authService.registerUser(req.body, req.user?.sub);
  return ApiResponse.created(res, user, "User registered successfully");
}

export async function login(req: Request, res: Response) {
  const result = await authService.loginUser(req.body, req.ip);
  setRefreshCookie(res, result.refreshToken);
  return ApiResponse.success(res, { user: result.user, accessToken: result.accessToken }, "Login successful");
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.[REFRESH_COOKIE] ?? req.body?.refreshToken;
  if (!token) throw new BadRequestError("Refresh token is required");

  const result = await authService.refreshTokens(token);
  setRefreshCookie(res, result.refreshToken);
  return ApiResponse.success(res, { user: result.user, accessToken: result.accessToken }, "Token refreshed");
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies?.[REFRESH_COOKIE] ?? req.body?.refreshToken;
  if (token) await authService.logoutUser(token);
  res.clearCookie(REFRESH_COOKIE, { path: "/api/v1/auth" });
  return ApiResponse.success(res, null, "Logged out successfully");
}

export async function me(req: Request, res: Response) {
  return ApiResponse.success(res, req.user, "Current user session");
}
