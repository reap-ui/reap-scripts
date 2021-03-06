import {resolve, join} from "path"

export default {
    clearMocks: true,
    coverageDirectory: join(process.cwd(), "coverage"),
    coverageProvider: "babel",
    testMatch: [
        "<rootDir>/tests/**/*.spec.[jt]s?(x)"
    ],
    transform: {
        "\\.[jt]sx?$": resolve(__dirname, "./babel-transform.js"),
        "\\.s?css$": resolve(__dirname, "./css-transform.js"),
        "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)": resolve(__dirname, "./file-transform.js")
    }
}