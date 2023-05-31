const fs = require("fs")
const path = require("path")
const homeDir = require('os').homedir();

const clearDir = function(path) {

  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path)

    if (files.length > 0) {
      files.forEach(function(filename) {
        if (fs.statSync(path + "/" + filename).isDirectory()) {
          clearDir(path + "/" + filename)
        } else {
          fs.unlinkSync(path + "/" + filename)
        }
      })
    } else {
      console.log("No files found in the directory.")
    }
  } else {
    console.log("Directory path not found.")
  }
}

const pathToDir = homeDir +'/Desktop/News-Images';

clearDir(pathToDir)