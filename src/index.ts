#!/usr/bin/env node

import { Command } from "commander";
import packageJSON from "../package.json";
import path from "path";
import copyDirectory from "./utils/copyDirectory";

const program = new Command();

program
  .name(packageJSON.name)
  .description(packageJSON.description)
  .version(packageJSON.version)
  .option("-t, --template <template>", "Specify a template to use.", "basic")
  .arguments("<targetName>")
  .action(async (targetName: string) => {
    const template = program.opts().template || "basic";
    const sourceDir = path.resolve(__dirname, "..", "templates", template);
    const targetDir = path.join(process.cwd(), targetName);

    try {
      await copyDirectory(sourceDir, targetDir);
      console.log("Basic template created successfully.");
    } catch (error) {
      console.error("Error creating basic template:", error);
    }
  });

program.parse(process.argv);
