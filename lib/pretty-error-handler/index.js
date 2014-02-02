var PrettyError = require("pretty-error"),
    env = process.env.NODE_ENV || 'production',
    domain = require('domain'),
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
    d.on('error', function(err) {

    
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

            html = html.replace("{statusCode}", res.statusCode)
            
            if (env == 'development') {
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
        for (var prop in err) error[prop] = err[prop];
        var json = JSON.stringify({
            error: error
        });
        res.setHeader("Content-Type", "application/json");
        res.end(json);
        // plain text
    } else {
        res.setHeader("Content-Type", "text/plain");
        res.end(err.stack);
    }

};