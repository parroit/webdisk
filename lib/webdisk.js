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

function listDirectory(root,type) {
    var output = through();
    fs.readdir(root, function(err,files){
        if (err) {
            return output.emit("error",err);
        }

        var remaining = files.length,
            firstOutput = true;

        files.forEach(function(file){
            fs.stat(path.resolve(root,file), function(err,stat){
                if (err) {
                    return output.emit("error",err);
                }

                if (stat[type] ()) {
                    output.write(file);
                    if (firstOutput) {
                        output.write("\n");
                        firstOutput = false;
                    }
                }

                remaining--;

                if (! remaining) {
                    output.end();            
                }
            });
            
        });

        

    });
    return output;
}


exports.listFiles = function(root) {
    return listDirectory(root,"isFile");
    
};

exports.listFolders = function(root) {
    return listDirectory(root,"isDirectory");
};


