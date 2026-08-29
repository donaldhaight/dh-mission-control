import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const packageDir = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.join(packageDir, "manifest.json");
const requiredStatusMarkers = ["Source-grounded", "Implemented", "Proposed", "Open decision"];

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

if (!fs.existsSync(manifestPath)) {
  fail("manifest.json is missing");
} else {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  for (const file of manifest.required_files ?? []) {
    const filePath = path.join(packageDir, file);
    if (!fs.existsSync(filePath)) fail(`required file is missing: ${file}`);
  }
  for (const decision of manifest.open_decisions ?? []) {
    if (!/^AGENT-\d{3}$/.test(decision)) fail(`invalid open decision ID: ${decision}`);
  }
}

const markdownFiles = fs.readdirSync(packageDir).filter((file) => file.endsWith(".md"));
for (const file of markdownFiles) {
  const content = fs.readFileSync(path.join(packageDir, file), "utf8");
  if (!content.startsWith("#")) fail(`${file} must start with a Markdown heading`);
  for (const match of content.matchAll(/\]\(([^)]+)\)/g)) {
    const link = match[1];
    if (link.startsWith("http://") || link.startsWith("https://") || link.startsWith("#")) continue;
    const target = path.resolve(packageDir, link.split("#")[0]);
    if (!fs.existsSync(target)) fail(`${file} contains a missing internal link: ${link}`);
  }
}

const readme = fs.readFileSync(path.join(packageDir, "README.md"), "utf8");
for (const marker of requiredStatusMarkers) {
  if (!readme.includes(`**${marker}**`)) fail(`README.md is missing source-status marker: ${marker}`);
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log(`PASS: ${markdownFiles.length} Markdown files and manifest validated in ${packageDir}`);
