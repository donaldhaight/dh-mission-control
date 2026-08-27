import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const manifestPath = join(root, "manifest.json");

if (!existsSync(manifestPath)) {
  throw new Error("Missing manifest.json");
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
if (!Array.isArray(manifest.required_files) || manifest.required_files.length === 0) {
  throw new Error("manifest.json must declare non-empty required_files");
}

const missing = manifest.required_files.filter(file => {
  const path = join(root, file);
  return !existsSync(path) || !statSync(path).isFile() || statSync(path).size === 0;
});

if (missing.length) {
  throw new Error(`Bundle is incomplete. Missing or empty: ${missing.join(", ")}`);
}

const markdownFiles = manifest.required_files.filter(file => file.endsWith(".md") && file !== "README.md");
const withoutStatus = markdownFiles.filter(file => !readFileSync(join(root, file), "utf8").includes("Source status"));
if (withoutStatus.length) {
  throw new Error(`Missing Source status section: ${withoutStatus.join(", ")}`);
}

const missingLinks = [];
for (const file of manifest.required_files.filter(file => file.endsWith(".md"))) {
  const documentPath = join(root, file);
  const document = readFileSync(documentPath, "utf8");
  const linkPattern = /\[[^\]]*\]\(([^)]+)\)/g;
  for (const match of document.matchAll(linkPattern)) {
    const target = match[1].trim();
    if (!target || target.startsWith("#") || /^(https?:|mailto:|manus-webdev:)/.test(target)) continue;
    const targetFile = target.split("#")[0];
    if (!targetFile) continue;
    const resolvedTarget = resolve(dirname(documentPath), targetFile);
    if (!resolvedTarget.startsWith(`${root}/`) && resolvedTarget !== root) {
      missingLinks.push(`${file} -> ${target} (outside bundle)`);
    } else if (!existsSync(normalize(resolvedTarget))) {
      missingLinks.push(`${file} -> ${target}`);
    }
  }
}
if (missingLinks.length) {
  throw new Error(`Broken internal Markdown links: ${missingLinks.join("; ")}`);
}

const provenance = readFileSync(join(root, "02-source-provenance.md"), "utf8");
const questions = readFileSync(join(root, "05-requirements-qa-register.md"), "utf8");
const verification = readFileSync(join(root, "09-source-and-open-question-verification.md"), "utf8");
for (const marker of ["Q212", "[S2]", "[S3]", "[S4]", "[S7]"]) {
  if (!provenance.includes(marker) || !verification.includes(marker)) {
    throw new Error(`Source verification is missing required marker: ${marker}`);
  }
}
for (const id of ["AGENT-002", "AGENT-003", "AGENT-004", "AGENT-005", "AGENT-006", "AGENT-007", "AGENT-008", "AGENT-009", "AGENT-010", "AGENT-011", "AGENT-012"]) {
  if (!questions.includes(id) || !verification.includes(id)) {
    throw new Error(`Open-question verification is missing required ID: ${id}`);
  }
}

console.log(`Open knowledge bundle validated: ${manifest.bundle_id} v${manifest.version} (${manifest.required_files.length} required files, internal links, source markers, and open-question IDs).`);

