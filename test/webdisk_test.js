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

        it("return all file names in folder", function(done) {
            webdisk.listFiles("test/files").pipe(concat(function( results) {
                
                results = JSON.parse(results);
                expect(results[0].name).to.be.equal("1.txt");
                expect(results[1].name).to.be.equal("2.txt");
                done();
            }));
            
        });

        it("return all file paths in folder", function(done) {
            webdisk.listFiles("test/files").pipe(concat(function( results) {
                
                results = JSON.parse(results);
                expect(results[0].path).to.be.equal("test/files/1.txt");
                expect(results[1].path).to.be.equal("test/files/2.txt");
                done();
            }));
            
        });

        it("return all file size in folder", function(done) {
            webdisk.listFiles("test/files").pipe(concat(function( results) {
                
                results = JSON.parse(results);
                expect(results[0].size).to.be.equal(5);
                expect(results[1].size).to.be.equal(5);
                done();
            }));
            
        });

        it("return all files uplodad date in folder", function(done) {
            webdisk.listFiles("test/files").pipe(concat(function( results) {
                
                results = JSON.parse(results);
                expect(results[0].uploaded).to.be.equal(1390811410000);
                expect(results[1].uploaded).to.be.equal(1390811410000);
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

        it("return all subfolders names", function(done) {
            webdisk.listFolders("test/files").pipe(concat(function( results) {
                
                results = JSON.parse(results);

                expect(results[0].name).to.be.equal("fold1");
                expect(results[1].name).to.be.equal("fold2");
                done();
            }));
            
        });

        it("return all subfolders paths", function(done) {
            webdisk.listFolders("test/files").pipe(concat(function( results) {
                
                results = JSON.parse(results);

                expect(results[0].path).to.be.equal("test/files/fold1");
                expect(results[1].path).to.be.equal("test/files/fold2");
                done();
            }));
            
        });
    });
});