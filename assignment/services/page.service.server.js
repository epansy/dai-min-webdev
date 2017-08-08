module.exports = function(app, models){

    var model = models.pageModel;

    //POST calls
    app.post("/api/website/:wid/page", createPage);

    //GET calls
    app.get("/api/website/:wid/page", findAllPagesForWebsite);
    app.get("/api/page/:pid", findPageById);

    //PUT calls
    app.put("/api/page/:pid", updatePage);

    //DELETE calls
    app.delete("/api/website/:wid/page/:pid", deletePage);

    //API calls implementation
    function createPage(req, res) {
        var wid = req.params.wid;
        var page = req.body;

        model
            .createPage(wid, page)
            .then(
                function (page) {
                    if(page){

                        res.json(page);

                    } else {

                        page = null;
                        res.send(page);
                    }
                },
                function (error) {

                    res.sendStatus(400).send("page service server, createPage error");
                }
            )

    }

    function findAllPagesForWebsite(req, res) {
        var wid = req.params.wid;

        model
            .findAllPagesForWebsite(wid)
            .then(
                function (pages) {

                    if(pages) {
                        res.json(pages);
                    } else {
                        pages = null;
                        res.send(pages);
                    }
                },
                function (error) {
                    res.sendStatus(400).send("page service server, findAllPagesForWebsite error");
                }
            )

    }

    function findPageById(req, res) {
        var pid = req.params.pid;

        model
            .findPageById(pid)
            .then(
                function (page) {
                    if (page) {
                        res.json(page);
                    } else {
                        page = null;
                        res.send(page);
                    }
                },
                function (error) {
                    res.sendStatus(400).send("page service server, findPageById error");
                }
            );

    }

    function updatePage(req, res) {
        var pid = req.params.pid;
        var page = req.body;

        model
            .updatePage(pid, page)
            .then(
                function (page) {
                    res.json(page);
                },
                function (error) {
                    res.status(400).send("page service server, updatePage error");
                }
            );

    }

    function deletePage(req, res) {
        var wid = req.params.wid;
        var pid = req.params.pid;

        if(pid){
            model
                .deletePage(wid, pid)
                .then(
                    function (status){
                        res.sendStatus(200);
                    },
                    function (error){
                        res.sendStatus(400).send(error);
                    }
                );
        } else{
            // Precondition Failed. Precondition is that the user exists.
            res.sendStatus(412);
        }

    }
};