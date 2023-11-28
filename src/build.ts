import Handlebars from "handlebars";
import { readFile, readdir, writeFile } from "fs/promises";
import { ensureDir } from "fs-extra";
import path from "path";

const TEMPLATE_DIR = path.resolve(__dirname, "..", "templates");
const OUTPUT_DIR = path.resolve(__dirname, "..", "dist");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "preset-manager.ini");

/**
 *
 * PotMode 1  |  PotMode 2   |  PotMode 5   |  PotMode 6
 *  1a   2a   |   3a   4a    |   1b   2b    |   3b   4b
 *  5a   6a   |   7a   8a    |   5b   6b    |   7b   8b
 * ___________|______________|______________|___________
 *            |              |
 * PotMode 3  |  PotMode 4   |  PotMode 7   |  PotMode 8
 *  9a  10a   |   11a 12a    |   9b  10b    |   11b 12b
 *  13a 14a   |   15a 16a    |   13b 14b    |   15b 16b
 *
 */
const PATCH_CONFIG = {
  presets: Array(15)
    .fill("")
    .map((_, idx) => ({ presetNumber: idx + 1 })),
  potModes: [
    { potMode: 1, buttonLight: "L1.1" },
    { potMode: 2, buttonLight: "L1.2" },
    { potMode: 3, buttonLight: "L1.3" },
    { potMode: 4, buttonLight: "L1.4" },
    { potMode: 5, buttonLight: "L2.1" },
    { potMode: 6, buttonLight: "L2.2" },
    { potMode: 7, buttonLight: "L2.3" },
    { potMode: 8, buttonLight: "L2.4" },
  ],
  cvs: [
    { cvNumber: 1, pot: "P1.1", aPotMode: 1, bPotMode: 5 },
    { cvNumber: 2, pot: "P2.1", aPotMode: 1, bPotMode: 5 },
    { cvNumber: 3, pot: "P1.1", aPotMode: 2, bPotMode: 6 },
    { cvNumber: 4, pot: "P2.1", aPotMode: 2, bPotMode: 6 },
    { cvNumber: 5, pot: "P1.2", aPotMode: 1, bPotMode: 5 },
    { cvNumber: 6, pot: "P2.2", aPotMode: 1, bPotMode: 5 },
    { cvNumber: 7, pot: "P1.2", aPotMode: 2, bPotMode: 6 },
    { cvNumber: 8, pot: "P2.2", aPotMode: 2, bPotMode: 6 },
    { cvNumber: 9, pot: "P1.1", aPotMode: 3, bPotMode: 7 },
    { cvNumber: 10, pot: "P2.1", aPotMode: 3, bPotMode: 7 },
    { cvNumber: 11, pot: "P1.1", aPotMode: 4, bPotMode: 8 },
    { cvNumber: 12, pot: "P2.1", aPotMode: 4, bPotMode: 8 },
    { cvNumber: 13, pot: "P1.2", aPotMode: 3, bPotMode: 7 },
    { cvNumber: 14, pot: "P2.2", aPotMode: 3, bPotMode: 7 },
    { cvNumber: 15, pot: "P1.2", aPotMode: 4, bPotMode: 8 },
    { cvNumber: 16, pot: "P2.2", aPotMode: 4, bPotMode: 8 },
  ],
};

Handlebars.registerHelper({
  eq: (v1, v2) => v1 === v2,
  ne: (v1, v2) => v1 !== v2,
  lt: (v1, v2) => v1 < v2,
  gt: (v1, v2) => v1 > v2,
  lte: (v1, v2) => v1 <= v2,
  gte: (v1, v2) => v1 >= v2,
  and() {
    return Array.prototype.every.call(arguments, Boolean);
  },
  or() {
    return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
  },
  cvName: (cvNumber) => `CV${cvNumber}`,
  // Function to do basic mathematical operation in handlebar
  math: function (lvalue, operator: "+" | "-" | "*" | "/" | "%", rvalue) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
      "+": lvalue + rvalue,
      "-": lvalue - rvalue,
      "*": lvalue * rvalue,
      "/": lvalue / rvalue,
      "%": lvalue % rvalue,
    }[operator];
  },
});

async function run() {
  const templatesPaths = await readdir(TEMPLATE_DIR);
  const templatesContents = await Promise.all(
    templatesPaths.map(async (templateFile) =>
      readFile(path.join(TEMPLATE_DIR, templateFile), "utf8").then(
        (contents) => [templateFile, contents]
      )
    )
  );

  const droidPatch = templatesContents
    .map(([name, contents]) => {
      console.log(`🔨 Compiling: ${name}`);
      return Handlebars.compile(contents, { strict: true })(PATCH_CONFIG);
    })
    .join("\n\n");

  await ensureDir(OUTPUT_DIR);
  await writeFile(OUTPUT_FILE, droidPatch);

  console.log(`\n✍️ Patch written to ${OUTPUT_FILE}`);
}

run()
  .then(() => console.log("\n✅ Build complete!"))
  .catch((e: unknown) => {
    console.error("\n❌ Build failed! ❌\n", e);
    process.exit(1);
  });
