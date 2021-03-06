(function(exports, global) {
    var $ = global.jQuery,
        utils = global.utils;


    function onFailure(xhr, textStatus, error) {
        console.log(textStatus + ": " + error);
    }



    function createFolderNode(folder) {
        return {
            title: folder.name,
            key: folder.path,
            children: [],
            folder: true,
            lazy: true
        };


    }

    function loadSubFolders(event, data) {
        var url = "/folders/" + encodeURIComponent(data.node.key);

        data.result = {
            url: url,
            data: {
                key: data.node.key
            }
        };

    }


    function readFolders() {

        $.getJSON("/folders/parroit")
            .fail(onFailure)
            .done(function(folders) {
                if (folders.error || folders.reason) {
                    return utils.flashError(
                        "Action could not be accomplished, an error has occurred <br>" +
                        folders.reason
                    );
                }

                var data = folders.map(function(f) {
                    return createFolderNode(f);
                });
                createTree(data);
            });
    }

    function createTree(data) {
        $(".folders-tree").fancytree({
            click: function(event, data) {
                if (data.targetType === "title") {
                    var node = data.node;
                    global.files.model.readFiles(node.key);
                }

            },
            loaderror: function(e, err) {
                utils.flashError(err.details);
                e.preventDefault();
                err.message = "";
                err.details = "";
                return false;
            },

            postProcess: function(e, data) {
                var folders = [];
                data.response.forEach(function(folder) {
                    folders.push(createFolderNode(folder));
                });
                data.result = folders;
            },
            clickFolderMode: 2,
            lazyload: loadSubFolders,

            source: data


        });
    }



    readFolders();

})(window, window);