/*
 * webdisk
 * https://github.com/parroit/webdisk
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

"use strict";

var expect = require("expect.js"),
    concat = require("concat-stream"),
    webdisk = require("../lib/webdisk");


describe("webdisk", function() {
    it("is defined", function() {
        expect(webdisk).to.be.an("object");
    });

    describe("listFiles", function() {
        it("is defined", function() {
            expect(webdisk.listFiles).to.be.an("function");
        });

        it("return readable stream", function() {
            expect(webdisk.listFiles(".").readable).to.be.equal(true);
        });

        it("return all files in folder", function(done) {
            webdisk.listFiles("test/files").pipe(concat(function( results) {
                expect(results).to.be.equal("1.txt\n2.txt");
                done();
            }));
            
        });
    });

    describe("listFolders", function() {

        it("is defined", function() {
            expect(webdisk.listFolders).to.be.an("function");
        });

        it("return readable stream", function() {
            expect(webdisk.listFolders(".").readable).to.be.equal(true);
        });

        it("return all subfolders", function(done) {
            webdisk.listFolders("test/files").pipe(concat(function( results) {
                expect(results).to.be.equal("fold1\nfold2");
                done();
            }));
            
        });
    });
});