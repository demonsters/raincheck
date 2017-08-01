const fs = require('fs')

function copy(pathName, outName) {
  fs.createReadStream(pathName)
      .pipe(fs.createWriteStream(outName))
}

// Dynamic
copy('./src/index.js.flow', './lib/index.js.flow')
