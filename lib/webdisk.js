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
    fs = require("fs"),
    root;

function listDirectory(folderPath, type) {
    if (!root)
        throw new Error("Undefined root folder. You must configure the module calling .configure(root)");


    var output = through();
    fs.readdir(path.resolve(root,folderPath), function(err, files) {
        if (err) {
            return output.emit("error", err);
        }



        var remaining = files.length,
            firstOutput = true;


        output.write("[");

        if (! files.length) {
            output.end("]");
        }

        files.forEach(function(file) {
            var fullPath = path.resolve(root,folderPath, file),
                relativePath = path.relative(root, fullPath);


            fs.stat(fullPath, function(err, stat) {
                if (err) {
                    return output.emit("error", err);
                }
                
                remaining--;

               

                if (stat[type]()) {


                    if (firstOutput) {
                        firstOutput = false;
                    } else {

                        output.write(",");
                    }

                    output.write(JSON.stringify({
                        path: relativePath.replace(/\\/g, "/"),
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

exports.configure = function(rootFolder) {
    root = rootFolder;
};

exports.listFiles = function(folderPath) {
    return listDirectory(folderPath, "isFile");

};

exports.listFolders = function(folderPath) {
    return listDirectory(folderPath, "isDirectory");
};