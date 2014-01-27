/*
 * webdisk
 * https://github.com/parroit/webdisk
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

"use strict";

var through = require("through-stream"),
    path = require("path"),
    fs = require("fs");

function listDirectory(root, type) {
    var output = through();
    fs.readdir(root, function(err, files) {
        if (err) {
            return output.emit("error", err);
        }

        var remaining = files.length,
            firstOutput = true;

        files.forEach(function(file) {
            var fullPath = path.resolve(root, file),
                relativePath = path.relative(process.cwd(),fullPath);

            fs.stat(fullPath, function(err, stat) {
                if (err) {
                    return output.emit("error", err);
                }

                remaining--;

                if (stat[type]()) {
                    

                    if (firstOutput) {
                        output.write("[");
                        firstOutput = false;
                    } else {
                        output.write(",");    
                    } 
                    
                    output.write(JSON.stringify({
                        path: relativePath.replace(/\\/g,"/"),
                        name: file,
                        size: stat.size,
                        uploaded: stat.ctime.getTime()

                    }));

                    
                }

                if (!remaining) {
                    output.end("]");
                }

                
            });

        });



    });
    return output;
}


exports.listFiles = function(root) {
    return listDirectory(root, "isFile");

};

exports.listFolders = function(root) {
    return listDirectory(root, "isDirectory");
};