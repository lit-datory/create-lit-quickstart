#!/usr/bin/env node

import { Command } from "commander"
import packageJSON from "../package.json"
import path from "path"
import copyDirectory from "./utils/copyDirectory"
import * as fs from "fs"
import { execSync } from "child_process"

const program = new Command()

program
  .name(packageJSON.name)
  .description(packageJSON.description)
  .version(packageJSON.version)
  .option("-t, --template <template>", "Specify a template to use.", "basic")
  .arguments("<targetName>")
  .action(async (targetName: string) => {
    const template = program.opts().template || "basic"
    const sourceDir = path.resolve(__dirname, "..", "templates", template)
    const targetDir = path.join(process.cwd(), targetName)

    try {
      console.log("Copy over the directory")
      await copyDirectory(sourceDir, targetDir)

      console.log("Setting up env files")
      const envFilePath = path.join(targetDir, ".env")
      fs.writeFileSync(envFilePath, `APP_NAME=${targetName}\n`)

      console.log("Update .gitignore")
      const gitIgnorePath = path.join(targetDir, ".gitignore")
      fs.appendFileSync(gitIgnorePath, ".env\n")
      fs.appendFileSync(gitIgnorePath, ".env.dev\n")
      fs.appendFileSync(gitIgnorePath, ".env.test\n")

      console.log("Set package.json name and author")
      const copiedPackageJSONPath = path.join(targetDir, "package.json")
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const copiedPackageJSON = require(copiedPackageJSONPath)
      copiedPackageJSON.name = targetName

      const gitUsername = execSync("git config user.name", {
        encoding: "utf-8",
      }).trim()
      if (gitUsername) copiedPackageJSON.author = gitUsername

      fs.writeFileSync(copiedPackageJSONPath, JSON.stringify(copiedPackageJSON, null, 2))

      console.log("Create Docker containers")
      execSync("make up", { cwd: targetDir, stdio: "inherit" })

      console.log("Install dependencies")
      execSync("make install", { cwd: targetDir, stdio: "inherit" })

      console.log("Git init")
      execSync("git init", { cwd: targetDir, stdio: "inherit" })

      console.log("Basic template created successfully.")
    } catch (error) {
      console.error("Error creating basic template:", error)
    }
  })

program.parse(process.argv)
