import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const queryFiles = [
  "src/lib/photos/photoQueries.ts",
  "src/lib/reactions/reactionQueries.ts",
  "src/lib/places/placeQueries.ts",
  "src/lib/people/personQueries.ts",
  "src/lib/events/eventQueries.ts",
  "src/lib/cleanup/cleanupQueries.ts",
  "src/lib/drive/driveConnectionQueries.ts"
];

const forbiddenSecretPatterns = [/SERVICE_ROLE/i, /service_role/i, /SUPABASE_SERVICE/i];
const googleServerFiles = [
  ".env.example",
  "src/lib/google/googleTypes.ts",
  "src/lib/google/oauth.ts",
  "src/lib/security/tokenCrypto.ts",
  "src/lib/drive/driveConnectionQueries.ts",
  "src/app/api/google/drive/oauth/start/route.ts",
  "src/app/api/google/drive/oauth/callback/route.ts",
  "src/app/admin/import/page.tsx"
];
const clientDirectories = ["src/app", "src/components"];

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

function assertNoPrivilegedKeyReferences() {
  const files = [
    ".env.example",
    "package.json",
    "src/lib/README.md",
    ...queryFiles,
    "src/lib/supabase/server.ts",
    "src/types/database.ts"
  ];

  const offenders = files.flatMap((file) => {
    const source = read(file);
    return forbiddenSecretPatterns.some((pattern) => pattern.test(source)) ? [file] : [];
  });

  if (offenders.length > 0) {
    throw new Error(`Privileged Supabase key reference found in: ${offenders.join(", ")}`);
  }
}

function assertNoClientSupabaseImports() {
  const clientFiles = clientDirectories.flatMap(walk).filter((file) => /\.(ts|tsx)$/.test(file));
  const offenders = clientFiles.filter((file) => {
    const source = read(file);
    if (!source.includes('"use client"') && !source.includes("'use client'")) return false;

    return source.includes("@supabase/supabase-js") || source.includes("createSupabaseServerClient");
  });

  if (offenders.length > 0) {
    throw new Error(`Client-side Supabase import found in: ${offenders.join(", ")}`);
  }
}

function assertNoClientGoogleSecretUsage() {
  const clientFiles = clientDirectories.flatMap(walk).filter((file) => /\.(ts|tsx)$/.test(file));
  const offenders = clientFiles.filter((file) => {
    const source = read(file);
    if (!source.includes('"use client"') && !source.includes("'use client'")) return false;

    return (
      source.includes("GOOGLE_CLIENT_SECRET") ||
      source.includes("TOKEN_ENCRYPTION_KEY") ||
      source.includes("refresh_token") ||
      source.includes("access_token")
    );
  });

  if (offenders.length > 0) {
    throw new Error(`Client-side Google secret/token usage found in: ${offenders.join(", ")}`);
  }
}

function assertNoRawTokenLoggingOrPlaceholders() {
  const files = [...googleServerFiles, ...queryFiles];
  const offenders = [];

  for (const file of files) {
    const source = read(file);
    const hits = [];

    if (/console\.(log|warn|error|info|debug)\([^)]*(access_token|refresh_token|tokenResponse)/s.test(source)) {
      hits.push("token logging");
    }

    if (source.includes("local-dev-access-token-placeholder") || source.includes("local-dev-refresh-token-placeholder")) {
      hits.push("local-dev token placeholder");
    }

    if (hits.length > 0) {
      offenders.push(`${file}: ${hits.join(", ")}`);
    }
  }

  if (offenders.length > 0) {
    throw new Error(`Raw token logging or placeholder storage found:\n${offenders.join("\n")}`);
  }
}

function assertNoDriveWriteScopesOrImportLogic() {
  const files = [...googleServerFiles, ...queryFiles];
  const forbiddenScopeFragments = [
    "https://www.googleapis.com/auth/drive\"",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.appdata",
    "https://www.googleapis.com/auth/drive.metadata",
    "https://www.googleapis.com/auth/drive.metadata.readonly",
    "https://www.googleapis.com/auth/drive.photos.readonly"
  ];
  const forbiddenLogicFragments = ["files.list", "drive.files", 'from "googleapis"', "from 'googleapis'"];
  const offenders = [];

  for (const file of files) {
    const source = read(file);
    const hits = [...forbiddenScopeFragments, ...forbiddenLogicFragments].filter((fragment) => source.includes(fragment));

    if (hits.length > 0) {
      offenders.push(`${file}: ${hits.join(", ")}`);
    }
  }

  if (offenders.length > 0) {
    throw new Error(`Forbidden Drive scope or import logic found:\n${offenders.join("\n")}`);
  }
}

function assertFamilyScopedQueries() {
  const offenders = [];

  for (const file of queryFiles) {
    const lines = read(file).split("\n");
    lines.forEach((line, index) => {
      if (!line.includes(".from(")) return;

      const block = lines.slice(index, index + 12).join("\n");
      const hasFamilyFilter = block.includes('.eq("family_id", familyId)');
      const hasFamilyInsert = block.includes("family_id: familyId");

      if (!hasFamilyFilter && !hasFamilyInsert) {
        offenders.push(`${file}:${index + 1}`);
      }
    });
  }

  if (offenders.length > 0) {
    throw new Error(`Potential unscoped Supabase query found at: ${offenders.join(", ")}`);
  }
}

assertNoPrivilegedKeyReferences();
assertNoClientSupabaseImports();
assertNoClientGoogleSecretUsage();
assertNoRawTokenLoggingOrPlaceholders();
assertNoDriveWriteScopesOrImportLogic();
assertFamilyScopedQueries();

console.log("Query layer validation passed.");
