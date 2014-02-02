var PrettyError = require("pretty-error"),
    env = process.env.NODE_ENV || "production",
    domain = require("domain"),
    fs = require("fs"),
    pe = new PrettyError();

function escape(html) {
    return String(html)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}



exports.handleErrorEvent = function responseErrorEvent(req, res, next) {
    var d = domain.create();
    d.on("error", function(err) {


        if (res.headerSent) {
            // instantiate PrettyError, which can then be used to

            console.error(pe.render(err));
            return res.end();
        }

        exports.handleException(err, req, res, next);

    });

    d.add(req);
    d.add(res);

    d.run(next);
};

exports.handleNotFound = function handleException(req, res, next) {
    var accept = req.headers.accept || "";

    if (~accept.indexOf("html")) {
        var defaultErrorPage = __dirname + "/page-not-found.html";
        console.dir(defaultErrorPage);

        fs.readFile(defaultErrorPage, "utf8", function(e, html) {
            console.dir(e);
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.status(404);
            res.end(html);
        });

        // json
    } else if (~accept.indexOf("json")) {


        res.json({
            ok: false,
            error: "404 page not found",
            reason: "404 page not found"
        });
        // plain text
    } else {
        res.setHeader("Content-Type", "text/plain");
        res.status(404);
        res.end("404 page not found");
    }
};

exports.handleException = function handleException(err, req, res, next) {


    if (err.status) {
        res.statusCode = err.status;
    }

    if (res.statusCode < 400) {
        res.statusCode = 500;
    }

    var prettyError = pe.render(err);
    console.error(prettyError);

    var accept = req.headers.accept || "";

    // html
    if (~accept.indexOf("html")) {
        var defaultErrorPage = __dirname + "/error.html";

        fs.readFile(defaultErrorPage, "utf8", function(e, html) {

            html = html.replace("{statusCode}", res.statusCode);

            if (env == "development") {
                html = html.replace("{error}", escape(err.stack));
            } else {
                html = html.replace("{error}", escape(err.message));
            }

            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(html);
        });

        // json
    } else if (~accept.indexOf("json")) {

        var error = {
            message: err.message,
            stack: err.stack
        };

        
        var json = JSON.stringify({
            error: error,
            reason: error,
            ok:false
        });
        res.setHeader("Content-Type", "application/json");
        res.end(json);
        // plain text
    } else {
        res.setHeader("Content-Type", "text/plain");
        res.end(err.stack);
    }

};