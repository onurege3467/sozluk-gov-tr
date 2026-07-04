import { execSync } from "node:child_process";
import { cp, mkdir, rm, readdir, rename, copyFile } from "node:fs/promises";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");

// Temizlik
await rm(dist, { recursive: true, force: true });

async function walk(dir: string, rel = ""): Promise<[string, string][]> {
  const entries: [string, string][] = [];
  for (const name of await readdir(dir, { withFileTypes: true })) {
    if (name.isDirectory()) {
      entries.push(...(await walk(join(dir, name.name), join(rel, name.name))));
    } else {
      entries.push([join(dir, name.name), join(rel, name.name)]);
    }
  }
  return entries;
}

async function copyAll(src: string, dest: string) {
  for (const [, rel] of await walk(src)) {
    const from = join(src, rel);
    const to = join(dest, rel);
    await mkdir(dirname(to), { recursive: true });
    await cp(from, to);
  }
}

// ESM build (ana)
execSync("npx tsc --outDir dist/.esm", { cwd: root, stdio: "inherit" });

// CJS build (sadece .js, bildirim yok)
execSync("npx tsc --project tsconfig.cjs.json", { cwd: root, stdio: "inherit" });

// CJS dosyalarını .js → .cjs yap
const cjsDir = join(dist, ".cjs");
for (const [full, rel] of await walk(cjsDir)) {
  const dest = join(dist, rel.replace(/\.js$/, ".cjs"));
  await mkdir(dirname(dest), { recursive: true });
  await cp(full, dest);
}

// ESM dosyalarını dist köküne taşı
for (const [full, rel] of await walk(join(dist, ".esm"))) {
  const dest = join(dist, rel);
  await mkdir(dirname(dest), { recursive: true });
  await cp(full, dest);
}

// .d.ts → .d.cts kopyala (CJS tüketicileri için)
for (const [full, rel] of await walk(dist)) {
  if (rel.endsWith(".d.ts") && !rel.startsWith(".")) {
    await copyFile(full, join(dist, rel.replace(/\.d\.ts$/, ".d.cts")));
  }
}

// Geçici klasörleri temizle
await rm(join(dist, ".esm"), { recursive: true });
await rm(join(dist, ".cjs"), { recursive: true });
