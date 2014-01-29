/*
 * auth
 * https://github.com/parroit/auth
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

"use strict";

module.exports = AuthStorage;

var Promise = require("promise"),
    fs = require("fs"),
    EventEmitter = require("events").EventEmitter;



/**
 * This object allows to manage users
 * within storage.
 * @param {Object} options  configuration options for object
 */
function AuthStorage(options) {
    var _this = this;
    _this.options = options;

    _this.dirty = false;
    _this.events = new EventEmitter();

    fs.readFile(options.file, function(err, data) {
        if (err) {
            throw err;
        }
        
        _this._users = JSON.parse(data);
        
        if (options.onReady) {
            options.onReady();
        }
    });
}



/**
 * set storage status to dirty, and if it actually clean, cause saving it to disk
 * after a while.
 *
 * @api private
 */
AuthStorage.prototype._setDirty = function() {
    var _this = this;
    if (!this.dirty) {
        setTimeout(function() {
            _this.dirty = false;
            _this.events.emit("storageSaved");
        }, 200);
        this.dirty = true;
    }
};

/**
 * Save a user into storage.
 *
 * @param {Object} user  the user object to save
 * @return {Object} a promise fullfilled with {status: "ok"}
 * @api public
 */
AuthStorage.prototype.saveUser = function(user) {
    this._setDirty();

    var users = this._users;

    return new Promise(function(resolve, reject) {
        users[user.username] = user;
        resolve({
            status: "ok"
        });
    });
};



/**
 * Retrieve a user from storage by name.
 *
 * @param {String} username  the username of the user to retrieve
 * @return {Object} a promise fullfilled with user object
 * @api public
 */
AuthStorage.prototype.getUser = function(username) {
    var users = this._users;
    return new Promise(function(resolve, reject) {
        resolve(users[username] || null);
    });
};

/**
 * Remove a user from storage.
 *
 * @param {String} username  username of user to remove
 * @return {Object} a promise fullfilled with {status: "ok"}
 * @api public
 */
AuthStorage.prototype.removeUser = function(username) {
    this._setDirty();
    var users = this._users;
    return new Promise(function(resolve, reject) {
        delete users[username];
        resolve({
            status: "ok"
        });
    });
};