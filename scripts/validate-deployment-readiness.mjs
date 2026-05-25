import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const requiredEnvNames = [
  "NEXT_PUBLIC_APP_NAME",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REDIRECT_URI",
  "GOOGLE_DRIVE_SCOPES",
  "TOKEN_ENCRYPTION_KEY",
  "BASIC_AUTH_USER",
  "BASIC_AUTH_PASSWORD"
];
const allowedNonEmptyExampleValues = new Map([
  ["NEXT_PUBLIC_APP_NAME", '"Family Memory Gallery"'],
  ["GOOGLE_DRIVE_SCOPES", '"https://www.googleapis.com/auth/drive.readonly"']
]);
const sourceRoots = ["src"];
const sourceExtensions = /\.(ts|tsx|js|jsx|mjs)$/;

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function walk(directory) {
  const absolute = join(root, directory);
  return readdirSync(absolute).flatMap((entry) => {
    const path = join(directory, entry);
    const stats = statSync(join(root, path));

    if (stats.isDirectory()) {
      return walk(path);
    }

    return path;
  });
}

function sourceFiles() {
  return sourceRoots.flatMap(walk).filter((file) => sourceExtensions.test(file));
}

function assertEnvExampleHasExpectedNames() {
  const envExample = read(".env.example");
  const missing = requiredEnvNames.filter((name) => {
    const pattern = new RegExp(`^#?\\s*${name}=`, "m");
    return !pattern.test(envExample);
  });

  if (missing.length > 0) {
    throw new Error(`.env.example is missing deployment env placeholders: ${missing.join(", ")}`);
  }
}

function assertEnvExampleDoesNotContainSecrets() {
  const offenders = [];
  const envExample = read(".env.example");

  for (const line of envExample.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = trimmed.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;

    const [, name, value] = match;
    const allowed = allowedNonEmptyExampleValues.get(name);
    if (allowed && value === allowed) continue;
    if (value === "") continue;

    offenders.push(name);
  }

  const forbiddenNames = [
    "SUPABASE_SERVICE_ROLE_KEY",
    "SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_GOOGLE_CLIENT_SECRET",
    "NEXT_PUBLIC_TOKEN_ENCRYPTION_KEY",
    "NEXT_PUBLIC_BASIC_AUTH_PASSWORD"
  ];
  const forbiddenHits = forbiddenNames.filter((name) => new RegExp(`^#?\\s*${name}=`, "m").test(envExample));

  if (offenders.length > 0 || forbiddenHits.length > 0) {
    throw new Error(
      `.env.example must contain placeholders only. Offenders: ${[...offenders, ...forbiddenHits].join(", ")}`
    );
  }
}

function assertNoPrivilegedSupabaseUsage() {
  const forbidden = [/SUPABASE_SERVICE/i, /SERVICE_ROLE/i, /service_role/i];
  const offenders = sourceFiles().filter((file) => forbidden.some((pattern) => pattern.test(read(file))));

  if (offenders.length > 0) {
    throw new Error(`Privileged Supabase key reference found in source: ${offenders.join(", ")}`);
  }
}

function assertNoClientSecretExposure() {
  const forbidden = [
    "NEXT_PUBLIC_GOOGLE_CLIENT_SECRET",
    "NEXT_PUBLIC_TOKEN_ENCRYPTION_KEY",
    "NEXT_PUBLIC_BASIC_AUTH_PASSWORD",
    "NEXT_PUBLIC_REFRESH_TOKEN",
    "NEXT_PUBLIC_ACCESS_TOKEN"
  ];
  const envExample = read(".env.example");
  const envOffenders = forbidden.filter((name) => new RegExp(`^#?\\s*${name}=`, "m").test(envExample));
  const offenders = sourceFiles().flatMap((file) => {
    const source = read(file);
    const hits = forbidden.filter((fragment) => source.includes(fragment));
    return hits.length > 0 ? [`${file}: ${hits.join(", ")}`] : [];
  });

  if (envOffenders.length > 0 || offenders.length > 0) {
    throw new Error(`Client-exposed secret variable found:\n${[...envOffenders, ...offenders].join("\n")}`);
  }
}

function assertDriveScopeIsReadOnly() {
  const envExample = read(".env.example");
  const scopeMatch = envExample.match(/^GOOGLE_DRIVE_SCOPES=(.*)$/m);

  if (!scopeMatch || scopeMatch[1] !== '"https://www.googleapis.com/auth/drive.readonly"') {
    throw new Error(".env.example must keep GOOGLE_DRIVE_SCOPES set to drive.readonly.");
  }

  const forbiddenScopeFragments = [
    "https://www.googleapis.com/auth/drive\"",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.appdata",
    "https://www.googleapis.com/auth/drive.metadata",
    "https://www.googleapis.com/auth/drive.metadata.readonly",
    "https://www.googleapis.com/auth/drive.photos.readonly"
  ];
  const offenders = sourceFiles().flatMap((file) => {
    const source = read(file);
    const hits = forbiddenScopeFragments.filter((fragment) => source.includes(fragment));
    return hits.length > 0 ? [`${file}: ${hits.join(", ")}`] : [];
  });

  if (offenders.length > 0) {
    throw new Error(`Forbidden Drive scope found:\n${offenders.join("\n")}`);
  }
}

function assertNoRawTokenLogging() {
  const offenders = sourceFiles().filter((file) => {
    const source = read(file);
    return /console\.(log|warn|error|info|debug)\([^)]*(access_token|refresh_token|tokenResponse)/s.test(source);
  });

  if (offenders.length > 0) {
    throw new Error(`Raw token logging pattern found in source: ${offenders.join(", ")}`);
  }
}

function assertNoOriginalImageOrBlobStorage() {
  const forbiddenPatterns = [
    /storage\.from\s*\(/,
    /\.upload\s*\(/,
    /\.download\s*\(/,
    /\.arrayBuffer\s*\(/,
    /new\s+Blob\s*\(/,
    /URL\.createObjectURL\s*\(/,
    /FileReader\s*\(/,
    /\.readAsDataURL\s*\(/
  ];
  const offenders = sourceFiles().flatMap((file) => {
    const source = read(file);
    const hits = forbiddenPatterns.filter((pattern) => pattern.test(source)).map((pattern) => pattern.source);
    return hits.length > 0 ? [`${file}: ${hits.join(", ")}`] : [];
  });

  if (offenders.length > 0) {
    throw new Error(`Original image/blob storage or download code found:\n${offenders.join("\n")}`);
  }
}

function assertOptionalMiddlewareIsSafe() {
  const candidates = ["middleware.ts", "middleware.js", "src/middleware.ts", "src/middleware.js"];
  const existing = candidates.filter((file) => {
    try {
      statSync(join(root, file));
      return true;
    } catch {
      return false;
    }
  });

  for (const file of existing) {
    const source = read(file);
    const usesBasicAuth = source.includes("BASIC_AUTH_USER") || source.includes("BASIC_AUTH_PASSWORD");

    if (!usesBasicAuth) continue;

    const requiresBothVars = /BASIC_AUTH_USER[\s\S]*BASIC_AUTH_PASSWORD/.test(source) && source.includes("&&");
    const skipsNextAssets = source.includes("_next") || source.includes("nextUrl.pathname.startsWith");
    const avoidsClientExposure = !source.includes("NEXT_PUBLIC_BASIC_AUTH");

    if (!requiresBothVars || !skipsNextAssets || !avoidsClientExposure) {
      throw new Error(`${file} Basic Auth middleware is not deployment-safe.`);
    }
  }
}

assertEnvExampleHasExpectedNames();
assertEnvExampleDoesNotContainSecrets();
assertNoPrivilegedSupabaseUsage();
assertNoClientSecretExposure();
assertDriveScopeIsReadOnly();
assertNoRawTokenLogging();
assertNoOriginalImageOrBlobStorage();
assertOptionalMiddlewareIsSafe();

console.log("Deployment readiness validation passed.");
