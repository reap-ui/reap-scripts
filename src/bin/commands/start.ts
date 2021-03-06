import {program} from "commander"
import getDevConf from "../../config/webpack/webpack.dev"
import {start as startDevServer} from "webpack-build-helper"
import devServerConf from "../../config/webpack/server.config"
import merge from "../../utils/merge-webpack"
import setEnv from "../../utils/set-env"
import {NAME} from "../constants"

function action(cmd: any) {
    const {
        config,
        port,
        open,
        ts,
        entry,
        index
    } = cmd
    const {
        merged,
        devServer
    } = merge(getDevConf(), config, ts, entry, index)
    const serverConf = {
        ...devServerConf,
        ...devServer
    }
    const _port = +port

    if (_port) {
        serverConf.port = _port
    }

    if (open !== undefined) {
        serverConf.open = open
    }

    setEnv("development")
    startDevServer(
        merged,
        {
            ...serverConf,
            hot: true
        }
    )
}

program
    .name(NAME)
    .command("start")
    .option("-p, --port [port]", "Specify a port")
    .option("-c, --config <file>", "Configuration file")
    .option("--no-ts", "Use javascript")
    .option("-o, --open", "Open browser")
    .option("-e, --entry <entry>", "Entry file, default src/[jt]sx")
    .option("--index <index>", "index.html file, default public/index.html")
    .action(action)
    .parse()