import path from "path";
import * as fs from "fs";

const copy = fs.promises.copyFile

export default async function copyDirectory(source: string, target: string) {
  const targetFolder = path.join(target);
  await fs.promises.mkdir(targetFolder, { recursive: true });

  const files = await fs.promises.readdir(source);
  for (const file of files) {
    const srcFile = path.join(source, file);
    const destFile = path.join(targetFolder, file);
    const fileStats = await fs.promises.stat(srcFile);

    if (fileStats.isDirectory()) {
      await copyDirectory(srcFile, destFile);
    } else {
      await copy(srcFile, destFile);
    }
  }
}
