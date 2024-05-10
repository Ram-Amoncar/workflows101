import { readFileSync, openSync, writeSync, close, readdirSync } from "fs"
import { resolve, extname } from "path"

const outDir = resolve(process.cwd(), "dist/")
const filenames = readdirSync(outDir, {
  withFileTypes: true,
})
const packInfo = JSON.parse(readFileSync("package.json").toString())
const license = Buffer.from(
  `/**\n * ${packInfo.name} v${packInfo.version}\n * Copyright (c) 2024 Ram Amoncar <ramamonkar444@gmail.com>\n * @license ${packInfo.license}\n */\n`
)
if (
  packInfo.hasOwnProperty("version") &&
  packInfo.hasOwnProperty("name") &&
  packInfo.hasOwnProperty("license")
) {
  for (const file of filenames) {
    if (extname(file.name) !== ".map" && file.isFile()) {
      const data = readFileSync(resolve(outDir, file.name))
      const fd = openSync(resolve(outDir, file.name), "w+")
      writeSync(fd, license, 0, license.length, 0)
      writeSync(fd, data, 0, data.length, license.length)
      close(fd, (err) => {
        if (err) throw err
      })
    }
  }
}
