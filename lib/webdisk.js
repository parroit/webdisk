/*
 * webdisk
 * https://github.com/parroit/webdisk
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

"use strict";

var through = require("through-stream"),
    mime = require("mime"),
    path = require("path"),
    fs = require("fs"),
    Promise = require("promise"),
    root,
    icons;

function WebDisk() {

}


WebDisk.prototype.writeStat = function(stat) {
    var relativePath = path.relative(root, stat.fullPath),
        mimeName = mime.lookup(stat.fullPath),
        mimeIcon = mimeName.replace(/\//g, "-") + ".png",
        _this = this;


    _this.output.write(JSON.stringify({
        path: relativePath.replace(/\\/g, "/"),
        name: stat.file,
        size: stat.size,
        uploaded: stat.ctime.getTime(),
        mime: mimeName,
        icon: icons.indexOf(mimeIcon) > -1 ? mimeIcon : "text-plain.png"
    }));



};

WebDisk.prototype.listOneFile = function(file) {



    var fullPath = path.resolve(root, this.folderPath, file),
        _this = this;

    fs.stat(fullPath, function(err, stat) {
        if (err) {
            return _this.output.emit("error", err);
        }

        _this.remaining--;

        var checkType = stat[_this.type].bind(stat);

        if (checkType()) {


            if (_this.firstOutput) {
                _this.firstOutput = false;
            } else {

                _this.output.write(",");
            }

            stat.file = file;
            stat.fullPath = fullPath;

            _this.writeStat(stat);

        }



        if (!_this.remaining) {
            _this.output.end("]");
        }


    });

};

WebDisk.prototype.listDirectory = function(folderPath, type) {
    if (!root)
        throw new Error("Undefined root folder. You must configure the module calling .configure(root)");


    var _this = this;

    this.folderPath = folderPath;
    this.type = type;
    this.output = through();

    fs.readdir(path.resolve(root, folderPath), function(err, files) {
        if (err) {
            return _this.output.emit("error", err);
        }


        _this.remaining = files.length;
        _this.firstOutput = true;

        _this.output.write("[");

        if (!files.length) {
            _this.output.end("]");
        }

        files.forEach(_this.listOneFile.bind(_this));



    });

    return _this.output;

};

exports.configure = function(rootFolder) {
    icons = fs.readdirSync(__dirname + "/../client/img/");
    root = rootFolder;
};

exports.listFiles = function(folderPath) {
    var wd = new WebDisk();
    return wd.listDirectory(folderPath, "isFile");

};


exports.deleteFiles = function(files) {


    return new Promise(function(resolve, reject) {
        var remaining = files.length,
            resolved = false;

        files.forEach(function(file) {
            if (resolved)    {
                return ;
            }

            var filePath = path.resolve(root, file);
            fs.exists(filePath,function(exists) {
                if (! exists) {
                    resolved = true;
                    resolve({
                        ok: false,
                        reason: "file " +file + " not found"
                    });
                }

                fs.unlink(filePath, function(err) {
                    if (err) {
                        resolved = true;
                        return reject(err);
                    }

                    if (!(--remaining)) {
                        resolve({
                            ok: true
                        });
                    }
                });
            });
        });

    });

};

exports.listFolders = function(folderPath) {
    var wd = new WebDisk();
    return wd.listDirectory(folderPath, "isDirectory");
};

exports.readFile = function(filePath, cb) {
    var fullPath = path.resolve(root, filePath),
        stream = fs.createReadStream(fullPath);



    fs.stat(fullPath, function(err, stat) {
        if (err) {
            return cb(err);
        }
        stream.name = path.basename(filePath);


        stream.mime = mime.lookup(fullPath);

        stream.size = stat.size;
        cb(null, stream);


    });
};