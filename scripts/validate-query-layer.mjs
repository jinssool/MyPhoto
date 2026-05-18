import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const queryFiles = [
  "src/lib/photos/photoQueries.ts",
  "src/lib/reactions/reactionQueries.ts",
  "src/lib/places/placeQueries.ts",
  "src/lib/people/personQueries.ts",
  "src/lib/events/eventQueries.ts",
  "src/lib/cleanup/cleanupQueries.ts"
];

const forbiddenSecretPatterns = [/SERVICE_ROLE/i, /service_role/i, /SUPABASE_SERVICE/i];
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
    return source.includes("@supabase/supabase-js") || source.includes("createSupabaseServerClient");
  });

  if (offenders.length > 0) {
    throw new Error(`Client-side Supabase import found in: ${offenders.join(", ")}`);
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
assertFamilyScopedQueries();

console.log("Query layer validation passed.");
