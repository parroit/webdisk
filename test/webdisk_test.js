/*
 * webdisk
 * https://github.com/parroit/webdisk
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

"use strict";

var expect = require("expect.js"),
    fs = require("fs"),
    concat = require("concat-stream"),
    webdisk = require("../lib/webdisk");


describe("webdisk", function() {

    before(function() {
        webdisk.configure(process.cwd());
        fs.unlinkSync("test/files/fold2/remove.this");
        fs.unlinkSync("test/only-folders/fold1/remove.this");
    });

    after(function() {
        fs.writeFileSync("test/files/fold2/remove.this", "remove.this");
        fs.writeFileSync("test/only-folders/fold1/remove.this", "remove.this");
    });

    function sortByName(array) {
        array.sort(function(a, b) {
            if (a.name === b.name) {
                return 0;
            }
            return a.name < b.name ? -1 : +1;
        });
    }

    it("is defined", function() {
        expect(webdisk).to.be.an("object");
    });

    describe("readFile", function() {
        var stream;

        before(function(done){
            webdisk.readFile("test/files/1.txt",function(err,data){
                if (err)
                    return console.log(err);
                stream = data;
                done();
            })
        });

        it("is defined", function() {
            expect(webdisk.readFile).to.be.an("function");
        });

        it("return readable stream", function() {
            expect(stream.readable).to.be.equal(true);
        });


        it("stream has mime type", function() {
            expect(stream.mime).to.be.equal("text/plain");
        });

         it("stream has name", function() {
            expect(stream.name).to.be.equal("1.txt");
        });

        it("stream has size", function() {
            expect(stream.size).to.be.equal(5);
        });

        it("unknown file has mime type application/octet-stream", function(done) {
            webdisk.readFile("test/strange/1.strange",function(err,strange){
                expect(strange.mime).to.be.equal("application/octet-stream");
                done();
            });
            
        });

        it("handle file with strange names", function(done) {
            webdisk.readFile("test/strange/strange file ' name",function(err,strange){
                expect(strange.size).to.be.equal(7);
                done();
            });
            
        });


        it("return file content", function(done) {
            stream.pipe(concat(function(results) {


                expect(results.toString("utf8")).to.be.equal("1.txt");

                done();
            }));

        });

    });

    describe("listFiles", function() {
        it("is defined", function() {
            expect(webdisk.listFiles).to.be.an("function");
        });

        it("return readable stream", function() {
            expect(webdisk.listFiles(".").readable).to.be.equal(true);
        });

        it("return all file names in folder", function(done) {
            webdisk.listFiles("test/files").pipe(concat(function(results) {

                results = JSON.parse(results);
                sortByName(results);
                expect(results[0].name).to.be.equal("1.txt");
                expect(results[1].name).to.be.equal("2.txt");
                done();
            }));

        });

        it("handle file with strange names", function(done) {
            webdisk.listFiles("test/strange").pipe(concat(function(results) {
                results = JSON.parse(results);
                sortByName(results);
                expect(results[1].name).to.be.equal("strange file ' name");
                done();
            }));
            
        });

        it("return folder with only files as empty array", function(done) {
            webdisk.listFiles("test/only-folders").pipe(concat(function(results) {


                expect(results).to.be.equal("[]");

                done();
            }));

        });


        it("return all file paths in folder", function(done) {
            webdisk.listFiles("test/files").pipe(concat(function(results) {
                results = JSON.parse(results);
                sortByName(results);
                expect(results[0].path).to.be.equal("test/files/1.txt");
                expect(results[1].path).to.be.equal("test/files/2.txt");
                done();
            }));

        });

        it("stream all file mime types in folder", function(done) {
            webdisk.listFiles("test/files").pipe(concat(function(results) {

                results = JSON.parse(results);
                sortByName(results);
                expect(results[0].mime).to.be.equal("text/plain");
                expect(results[1].mime).to.be.equal("text/plain");
                done();
            }));

        });

        it("return empty folder as empty array", function(done) {
            webdisk.listFiles("test/files/fold2").pipe(concat(function(results) {


                expect(results).to.be.equal("[]");

                done();
            }));

        });

        it("return all file size in folder", function(done) {
            webdisk.listFiles("test/files").pipe(concat(function(results) {

                results = JSON.parse(results);
                sortByName(results);
                expect(results[0].size).to.be.equal(5);
                expect(results[1].size).to.be.equal(5);
                done();
            }));

        });

        it("return all files uplodad date in folder", function(done) {
            webdisk.listFiles("test/files").pipe(concat(function(results) {

                results = JSON.parse(results);
                sortByName(results);
                expect(results[0].uploaded).to.be.greaterThan(1390843380000);
                expect(results[1].uploaded).to.be.greaterThan(1390843380000);
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
            webdisk.listFolders("test/files").pipe(concat(function(results) {

                results = JSON.parse(results);
                sortByName(results);
                expect(results[0].name).to.be.equal("fold1");
                expect(results[1].name).to.be.equal("fold2");
                done();
            }));

        });

        it("return empty folder as empty array", function(done) {
            webdisk.listFolders("test/files/fold2").pipe(concat(function(results) {


                expect(results).to.be.equal("[]");

                done();
            }));

        });

        it("return folder with only files as empty array", function(done) {
            webdisk.listFolders("test/files/fold1").pipe(concat(function(results) {


                expect(results).to.be.equal("[]");

                done();
            }));

        });
        it("return all subfolders paths", function(done) {
            webdisk.listFolders("test/files").pipe(concat(function(results) {

                results = JSON.parse(results);
                sortByName(results);
                expect(results[0].path).to.be.equal("test/files/fold1");
                expect(results[1].path).to.be.equal("test/files/fold2");
                done();
            }));

        });
    });
});