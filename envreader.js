const fs = require("fs");
const path = require("path");
require("dotenv").config({path: "src/.env"})

const fileText = `
export const environment = {
    GOOGLE_KEY: "${process.env.GOOGLE_KEY}"
}
`
const targetPath = path.join(__dirname, `./src/environments/environment.${process.argv[2]}.ts`);

fs.writeFileSync(targetPath, fileText)