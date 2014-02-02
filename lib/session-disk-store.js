var fs = require("fs"),
    path = require("path");

module.exports = function(Store) {

    /**
     * Initialize a new `SessionDiskStore`.
     *
     * @api public
     */

    var SessionDiskStore = function SessionDiskStore(options) {
        this.options = options;


        if (!fs.existsSync(options.path)) {
            fs.mkdirSync(options.path, 0777);
        }
    };

    /**
     * Inherit from `Store.prototype`.
     */

    SessionDiskStore.prototype = new Store();

    SessionDiskStore.prototype.expired = function(session) {
        var expires;

        if ("string" == typeof session.cookie.expires) {
            expires = new Date(session.cookie.expires);
        } else {
            expires = session.cookie.expires;
        }

        return expires && new Date() >= expires;
    }


    /**
     * Attempt to fetch session by the given `sid`.
     *
     * @param {String} sid
     * @param {Function} cb
     * @api public
     */

    SessionDiskStore.prototype.get = function(sid, cb) {
        var _this = this,
            retries = 50,
            sessionPath = this._getSessionPath(sid);

        function readSessionData(err, sess) {
            if (err) {
                return cb(err);
            }

            if ((!sess) && retries--) {
                //console.log("RETRY LATER", sessionPath, sess)
                return setTimeout(function() {
                    fs.readFile(sessionPath, "utf8", readSessionData);
                }, 100);
            }

            //console.dir(sess)

            sess = JSON.parse(sess);

            if ( !_this.expired(sess) ) {
                return cb(null, sess);
            }

            //console.log(sid + " expired");
            _this.destroy(sid, cb);
            cb();


        }

        //console.log("READ SESSION %s", sid)

        fs.exists(sessionPath, function(exists) {
            if (!exists) {
                return cb();
            }
            fs.readFile(sessionPath, "utf8", readSessionData);
        });



    };

    SessionDiskStore.prototype._getSessionPath = function(sid) {
        return path.join(this.options.path, sid);
    }

    /**
     * Commit the given `sess` object associated with the given `sid`.
     *
     * @param {String} sid
     * @param {Session} sess
     * @param {Function} cb
     * @api public
     */

    SessionDiskStore.prototype.set = function(sid, sess, cb) {
        var content = JSON.stringify(sess, null, "\t");

        fs.writeFile(this._getSessionPath(sid), content, cb);

    };

    /**
     * Destroy the session associated with the given `sid`.
     *
     * @param {String} sid
     * @api public
     */

    SessionDiskStore.prototype.destroy = function(sid, cb) {

        fs.unlink(this._getSessionPath(sid), cb);

    };

    /**
     * Invoke the given callback `cb` with all active sessions.
     *
     * @param {Function} cb
     * @api public
     */

    SessionDiskStore.prototype.all = function(cb) {

        var _this = this;
        fs.readdir(this.options.path, function(err, files) {
            files.forEach(function(file) {
                _this.get(file, cb);

            });
        });

    };

    /**
     * Clear all sessions.
     *
     * @param {Function} cb
     * @api public
     */

    SessionDiskStore.prototype.clear = function(cb) {
        var path = this.options.path;
        fs.unlink(path, function(err) {
            if (err) {
                return cb(err);
            }

            fs.mkdir(path, 770, function(err) {
                if (err) {
                    return cb(err);
                }
                cb();

            });

        });

    };


    /**
     * Fetch number of sessions.
     *
     * @param {Function} cb
     * @api public
     */

    SessionDiskStore.prototype.length = function(cb) {
        fs.readdir(this.options.path, function(err, files) {
            if (err) {
                return cb(err);
            }

            cb(null, files.length);
        });

    };

    return SessionDiskStore;
};