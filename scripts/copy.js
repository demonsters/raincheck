
const find = require('find');
const path = require('path');
const fs = require('fs-extra')

const src = path.resolve(__dirname, '../src/')
const lib = path.resolve(__dirname, '../lib/')

// Copy flow files
find.file(/\.js.flow$/, src, function(files) {
  files.forEach(file => {
    fs.copy(file, path.resolve(lib, path.relative(src, file)))
  })
})
