import chalk from "chalk"
import {program} from "commander"
import fs from "fs"
import path from "path"
import spawn from "cross-spawn"
import rimraf from "rimraf"

const tsc = program.command("tsc [file]")

function initTs() {
    const filePath = path.join(__dirname, "../../tsconfig.json")
    const destFile = path.join(process.cwd(), "tsconfig.json")

    if (fs.existsSync(destFile)) {
        return console.log(chalk.red("tsconfig.json already exists"))
    }

    fs.copyFileSync(filePath, destFile)
    console.log(chalk.green("Successfully created a tsconfig.json file"))
}

function spawnTsc(args: string[], removeDir?: string) {
    try {
        removeDir && rimraf.sync(removeDir)
        spawn(
            "tsc",
            args,
            {
                shell: true,
                stdio: "inherit"
            }
        )
    } catch (error) {
        console.log(error)
    }
}

function action(file: string, cmd: any) {
    const {
        init,
        lib,
        es,
        declaration
    } = cmd
    const args = ["-t", "ES6"]

    if (init) {
        initTs()

        return
    }

    if (file) {
        args.unshift(file)
    }

    if (declaration) {
        args.push("-d")
    }

    if (!lib && !es) {
        spawnTsc(args)

        return
    }

    if (lib) {
        spawnTsc(
            [
                ...args,
                "-m",
                "CommonJS",
                "--outDir",
                "./lib"
            ],
            "./lib"
        )
    }

    if (es) {
        spawnTsc(
            [
                ...args,
                "-m",
                "ESNext",
                "--outDir",
                "./es"
            ],
            "./es"
        )
    }
}

tsc
    .option("--init", "Init tsconfig.json")
    .option("--lib", "Build commonjs")
    .option("--es", "Build ESNext")
    .option("-d, declaration", "Doesn't generate declaration files")
    .action(action)
