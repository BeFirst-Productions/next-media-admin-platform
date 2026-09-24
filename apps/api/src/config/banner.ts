import os from "node:os";

interface BannerConfig {
  port: number;
  apiPrefix: string;
  clientUrl: string;
  nodeEnv: string;
  databaseConnected: boolean;
  bootDurationMs: number;
}

// Check if colors should be applied
const isColorSupported =
  !("NO_COLOR" in process.env) &&
  process.env.TERM !== "dumb";

const c = {
  reset: isColorSupported ? "\x1b[0m" : "",
  bold: isColorSupported ? "\x1b[1m" : "",
  dim: isColorSupported ? "\x1b[2m" : "",
  underline: isColorSupported ? "\x1b[4m" : "",

  // Standard colors
  black: isColorSupported ? "\x1b[30m" : "",
  red: isColorSupported ? "\x1b[31m" : "",
  green: isColorSupported ? "\x1b[32m" : "",
  yellow: isColorSupported ? "\x1b[33m" : "",
  blue: isColorSupported ? "\x1b[34m" : "",
  magenta: isColorSupported ? "\x1b[35m" : "",
  cyan: isColorSupported ? "\x1b[36m" : "",
  white: isColorSupported ? "\x1b[37m" : "",
  gray: isColorSupported ? "\x1b[90m" : "",

  // Bright colors
  brightGreen: isColorSupported ? "\x1b[92m" : "",
  brightCyan: isColorSupported ? "\x1b[96m" : "",
  brightYellow: isColorSupported ? "\x1b[93m" : "",
  brightBlue: isColorSupported ? "\x1b[94m" : "",
  brightMagenta: isColorSupported ? "\x1b[95m" : "",
  brightRed: isColorSupported ? "\x1b[91m" : "",
  brightWhite: isColorSupported ? "\x1b[97m" : "",
};

/**
 * Strips ANSI escape sequences to compute visible length accurately.
 */
function stripAnsi(text: string): string {
  // eslint-disable-next-line no-control-regex
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}

/**
 * Pads a string according to visible character count (ignoring ANSI codes).
 */
function padVisible(text: string, width: number): string {
  const visible = stripAnsi(text).length;
  const pad = Math.max(0, width - visible);
  return text + " ".repeat(pad);
}

/**
 * Returns the primary non-internal IPv4 address for local network access.
 */
export function getLocalNetworkIp(): string | null {
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      const list = interfaces[name];
      if (!list) continue;
      for (const net of list) {
        const isIpv4 = net.family === "IPv4" || (net.family as unknown as number) === 4;
        if (isIpv4 && !net.internal) {
          return net.address;
        }
      }
    }
  } catch {
    // Return null if network detection fails
  }
  return null;
}

/**
 * Prints a clean, professional, informative startup dashboard in the terminal.
 */
export function printServerBanner(config: BannerConfig): void {
  const boxWidth = 78;
  const contentWidth = boxWidth - 4; // 2 spaces on left, 2 spaces on right inside borders
  const networkIp = getLocalNetworkIp();

  const padLine = (content: string): string => {
    const visibleLen = stripAnsi(content).length;
    const padding = Math.max(0, contentWidth - visibleLen);
    return `  │  ${content}${" ".repeat(padding)}  │`;
  };

  const justifyLine = (left: string, right: string): string => {
    const leftLen = stripAnsi(left).length;
    const rightLen = stripAnsi(right).length;
    const gap = Math.max(1, contentWidth - leftLen - rightLen);
    return `  │  ${left}${" ".repeat(gap)}${right}  │`;
  };

  const hr = `  ├${"─".repeat(boxWidth)}┤`;
  const top = `  ╭${"─".repeat(boxWidth)}╮`;
  const bottom = `  ╰${"─".repeat(boxWidth)}╯`;
  const emptyLine = `  │${" ".repeat(boxWidth)}│`;

  // Status & environment styling
  const envTag = config.nodeEnv.toUpperCase();
  const envColor =
    config.nodeEnv === "production"
      ? c.brightMagenta
      : config.nodeEnv === "test"
        ? c.brightYellow
        : c.brightCyan;

  const dbStatus = config.databaseConnected
    ? `${c.brightGreen}PostgreSQL (Prisma 7 • Connected)${c.reset}`
    : `${c.brightRed}PostgreSQL (Disconnected)${c.reset}`;

  const networkUrl = networkIp
    ? `http://${networkIp}:${config.port}${config.apiPrefix}`
    : "Not available (LAN offline)";

  const headerLeft = `${c.bold}${c.brightCyan}NEXT DIGITAL CRM API${c.reset} ${c.dim}v0.1.0${c.reset}`;
  const headerRight = `${c.brightGreen}● ONLINE${c.reset} ${envColor}[${envTag}]${c.reset}`;

  const col1Width = 36;

  const lines: string[] = [
    "",
    top,
    emptyLine,
    justifyLine(headerLeft, headerRight),
    padLine(`${c.dim}Enterprise Digital Media Operations & Client Engine${c.reset}`),
    emptyLine,
    hr,
    emptyLine,
    padLine(`${c.bold}${c.brightWhite}ENDPOINTS${c.reset}`),
    padLine(
      `  ${c.cyan}➜${c.reset}  ${c.gray}Local API:${c.reset}        ${c.bold}${c.brightCyan}http://localhost:${config.port}${config.apiPrefix}${c.reset}`,
    ),
    padLine(
      `  ${c.cyan}➜${c.reset}  ${c.gray}Network API:${c.reset}      ${c.cyan}${networkUrl}${c.reset}`,
    ),
    padLine(
      `  ${c.cyan}➜${c.reset}  ${c.gray}Health Check:${c.reset}     ${c.green}http://localhost:${config.port}/health${c.reset}`,
    ),
    padLine(
      `  ${c.cyan}➜${c.reset}  ${c.gray}Client Webapp:${c.reset}    ${c.yellow}${config.clientUrl}${c.reset}`,
    ),
    emptyLine,
    hr,
    emptyLine,
    padLine(`${c.bold}${c.brightWhite}ENVIRONMENT & ENGINE${c.reset}`),
    padLine(
      `  ${c.dim}•${c.reset}  ${c.gray}Node.js:${c.reset}          ${process.version} ${c.dim}(PID: ${process.pid})${c.reset}`,
    ),
    padLine(
      `  ${c.dim}•${c.reset}  ${c.gray}Database:${c.reset}         ${dbStatus}`,
    ),
    padLine(
      `  ${c.dim}•${c.reset}  ${c.gray}Logging:${c.reset}          pino @ ${c.brightCyan}info${c.reset} ${c.dim}(pretty transport enabled)${c.reset}`,
    ),
    padLine(
      `  ${c.dim}•${c.reset}  ${c.gray}Security:${c.reset}         Helmet • CORS • Rate Limiting ${c.dim}(300 req / 15m)${c.reset}`,
    ),
    emptyLine,
    hr,
    emptyLine,
    padLine(`${c.bold}${c.brightWhite}CORE API MODULES${c.reset}`),
    padLine(
      `  ${padVisible(`${c.dim}•${c.reset} ${c.white}Auth & Security${c.reset}   ${c.gray}(/auth)${c.reset}`, col1Width)}` +
      `${c.dim}•${c.reset} ${c.white}Proposals & Deals${c.reset}   ${c.gray}(/proposals)${c.reset}`,
    ),
    padLine(
      `  ${padVisible(`${c.dim}•${c.reset} ${c.white}Leads & Clients${c.reset}   ${c.gray}(/leads)${c.reset}`, col1Width)}` +
      `${c.dim}•${c.reset} ${c.white}Invoices & Billing${c.reset}  ${c.gray}(/invoices)${c.reset}`,
    ),
    padLine(
      `  ${padVisible(`${c.dim}•${c.reset} ${c.white}Service Packages${c.reset}  ${c.gray}(/packages)${c.reset}`, col1Width)}` +
      `${c.dim}•${c.reset} ${c.white}Audit & Logging${c.reset}     ${c.gray}(/audit-logs)${c.reset}`,
    ),
    emptyLine,
    bottom,
    `  ${c.brightGreen}⚡ Server ready in ${config.bootDurationMs}ms${c.reset}  ${c.dim}│${c.reset}  ${c.gray}Listening on port ${config.port}${c.reset}  ${c.dim}│${c.reset}  ${c.gray}Press ${c.bold}${c.yellow}Ctrl+C${c.reset}${c.gray} to stop${c.reset}`,
    "",
  ];

  // eslint-disable-next-line no-console
  console.log(lines.join("\n"));
}

/**
 * Prints graceful shutdown steps clearly in the terminal.
 */
export function printShutdownMessage(signal: string, step: "start" | "http_closed" | "db_closed" | "done"): void {
  const prefix = `  ${c.dim}[${new Date().toLocaleTimeString()}]${c.reset}`;
  switch (step) {
    case "start":
      // eslint-disable-next-line no-console
      console.log(`\n${prefix} ${c.bold}${c.yellow}🛑 [${signal}] Shutdown signal received. Closing services gracefully...${c.reset}`);
      break;
    case "http_closed":
      // eslint-disable-next-line no-console
      console.log(`${prefix}   ${c.green}✔${c.reset} Express HTTP listener stopped (connections drained)`);
      break;
    case "db_closed":
      // eslint-disable-next-line no-console
      console.log(`${prefix}   ${c.green}✔${c.reset} PostgreSQL database disconnected cleanly`);
      break;
    case "done":
      // eslint-disable-next-line no-console
      console.log(`${prefix} ${c.bold}${c.brightGreen}✔ Next Digital CRM API shutdown complete. Goodbye!${c.reset}\n`);
      break;
  }
}

/**
 * Formats a startup error into a clear, diagnostic box with troubleshooting tips.
 */
export function printStartupErrorBanner(error: unknown): void {
  const boxWidth = 78;
  const contentWidth = boxWidth - 4;
  const hr = `  ├${"─".repeat(boxWidth)}┤`;
  const top = `  ╭${"─".repeat(boxWidth)}╮`;
  const bottom = `  ╰${"─".repeat(boxWidth)}╯`;
  const emptyLine = `  │${" ".repeat(boxWidth)}│`;

  const padLine = (content: string): string => {
    const visibleLen = stripAnsi(content).length;
    const padding = Math.max(0, contentWidth - visibleLen);
    return `  │  ${content}${" ".repeat(padding)}  │`;
  };

  const errorMessage = error instanceof Error ? error.message : String(error);
  const isDbError = errorMessage.toLowerCase().includes("database") || errorMessage.toLowerCase().includes("prisma") || errorMessage.toLowerCase().includes("connect");
  const isPortError = errorMessage.toLowerCase().includes("eaddrinuse");

  const lines: string[] = [
    "",
    top,
    emptyLine,
    padLine(`${c.bold}${c.brightRed}[FAILED] SERVER STARTUP ERROR${c.reset}`),
    emptyLine,
    hr,
    emptyLine,
    padLine(`${c.bold}${c.white}ERROR DETAILS:${c.reset}`),
    padLine(`  ${c.red}${errorMessage.slice(0, contentWidth - 4)}${c.reset}`),
    emptyLine,
    hr,
    emptyLine,
    padLine(`${c.bold}${c.white}TROUBLESHOOTING TIPS:${c.reset}`),
  ];

  if (isPortError) {
    lines.push(
      padLine(`  ${c.yellow}1.${c.reset} Port is already in use by another running process.`),
      padLine(`  ${c.yellow}2.${c.reset} Stop the other process or change PORT in ${c.cyan}apps/api/.env${c.reset}.`),
    );
  } else if (isDbError) {
    lines.push(
      padLine(`  ${c.yellow}1.${c.reset} Check if PostgreSQL Docker container is running:`),
      padLine(`     ${c.cyan}docker compose ps${c.reset}`),
      padLine(`  ${c.yellow}2.${c.reset} Start the database container:`),
      padLine(`     ${c.cyan}docker compose up -d postgres${c.reset}`),
      padLine(`  ${c.yellow}3.${c.reset} Verify DATABASE_URL in ${c.cyan}apps/api/.env${c.reset}`),
    );
  } else {
    lines.push(
      padLine(`  ${c.yellow}1.${c.reset} Verify configuration values in ${c.cyan}apps/api/.env${c.reset}`),
      padLine(`  ${c.yellow}2.${c.reset} Generate Prisma client:`),
      padLine(`     ${c.cyan}pnpm prisma:generate${c.reset}`),
    );
  }

  lines.push(emptyLine, bottom, "");

  // eslint-disable-next-line no-console
  console.error(lines.join("\n"));
}
