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
    _users = {};

/**
 * This object allows to manage users
 * within storage.
 * @param {Object} options  configuration options for object
 */
function AuthStorage(options) {
    this.options = options;
}


/**
 * Save a user into storage.
 *
 * @param {Object} user  the user object to save
 * @return {Object} a promise fullfilled with {status: "ok"}
 * @api public
 */
AuthStorage.prototype.saveUser = function(user) {

    return new Promise(function(resolve, reject) {
        _users[user.username] = user;
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
    //console.dir(_users);
    return new Promise(function(resolve, reject) {
        resolve(_users[username] || null);
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

    return new Promise(function(resolve, reject) {
        delete _users[username];
        resolve({
            status: "ok"
        });
    });
};