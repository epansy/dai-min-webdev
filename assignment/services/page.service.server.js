module.exports = function(app, models){

    var pageModel = models.pageModel;


    //POST calls
    app.post("/api/website/:wid/page", createPage);

    //GET calls
    app.get("/api/website/:wid/page", findAllPagesForWebsite);
    app.get("/api/page/:pid", findPageById);

    //PUT calls
    app.put("/api/page/:pid", updatePage);

    //DELETE calls
    app.delete("/api/page/:pid", deletePage);

    //API calls implementation
    function createPage(req, res) {
        var wid = req.params.wid;
        var page = req.body;

        pageModel
            .createPage(wid, page)
            .then(
                function (page) {
                    res.json(page);
                },
                function (error) {
                    res.send(error);
                });
    }

    function findAllPagesForWebsite(req, res) {
        var wid = req.params.wid;
        pageModel
            .findAllPagesForWebsite(wid)
            .then(function (pages) {
                res.json(pages);
            }, function (error) {
                res.send(error);
            });
    }

    function findPageById(req, res) {
        var pid = req.params.pid;

        pageModel
            .findPageById(pid)
            .then(function (page) {
                res.json(page);
            }, function (error) {
                res.send(error);
            });
    }

    function updatePage(req, res) {
        var pid = req.params.pid;
        var page = req.body;

        pageModel
            .updatePage(pid, page)
            .then(function (page) {
                res.json(page);
            }, function (status) {
                res.send(status);
            });
    }

    function deletePage(req, res) {
        var pid = req.params.pid;
        pageModel
            .deletePage(wid, pid)
            .then(function (status) {
                res.send(status);
            });
    }

};