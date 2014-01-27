(function(exports, global) {
    var $ = global.jQuery;


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

        var data = createFolderNode({
            name: "test",
            path: "test"
        });

        $(".folders-tree").fancytree({
            postProcess: function(e,data){
                var folders = [];
                data.response.forEach(function(folder){
                    folders.push(createFolderNode(folder));
                });
                data.result = folders;
            },
            clickFolderMode: 2,
            lazyload: loadSubFolders,

            source: [data]


        });
    }


    
    readFolders();

})(window, window);