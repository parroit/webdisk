(function model(exports, global) {
    var $ = global.jQuery;

    function flashError(msg) {
        var tmplt = $("#error-template").clone();
        tmplt.append(msg);
        tmplt.removeClass("hidden");
        $(".flashes").append(tmplt);
    }

    function msgbox(title, content, type, cb) {
        var dialog = $("#msgbox"),
            icon = dialog.find(".modal-body .glyphicon");


        if (!type || type === "success") {
            icon.addClass("glyphicon-ok-circle green");
        } else if (type === "failure") {
            icon.addClass("glyphicon-exclamation-sign red");
        }

        dialog.find(".ok-btn").click(function(e) {
            dialog.find(".ok-btn").off("click");
            if (cb) {
                cb();
            }
        });

        dialog.attr("aria-labelledby", title);
        dialog.find(".modal-title").html(title);
        dialog.find(".msgbox-content").html(content);

        dialog.modal("show");
    }

    function confirm(title, content, cb) {
        var dialog = $("#confirm");

        dialog.attr("aria-labelledby", title);
        dialog.find(".modal-title").html(title);
        dialog.find(".msgbox-content").html(content);


        dialog.find(".yes-btn").click(function(e) {
            dialog.find(".yes-btn").off("click");
            dialog.find(".no-btn").off("click");
            cb("yes");
        });

        dialog.find(".no-btn").click(function(e) {
            dialog.find(".yes-btn").off("click");
            dialog.find(".no-btn").off("click");
            cb("no");
        });

        dialog.modal("show");
    }

    exports.utils = {
        confirm: confirm,
        msgbox: msgbox,
        flashError: flashError

    };
})(window, window);