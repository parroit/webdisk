/*
 * webdisk
 * https://github.com/parroit/webdisk
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

"use strict";

var expect = require("expect.js"),
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
    });

    describe("listFolder", function() {

        it("is defined", function() {
            expect(webdisk.listFolder).to.be.an("function");
        });

        it("return readable stream", function() {
            expect(webdisk.listFolder(".").readable).to.be.equal(true);
        });
    });
});