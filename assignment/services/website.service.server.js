module.exports = function(app, models){

    var websiteModel = models.websiteModel;

    //POST Calls
    app.post('/api/user/:uid/website',createWebsite);

    //GET Calls
    app.get('/api/user/:uid/website',findWebsitesByUser);
    app.get('/api/website/:wid',findWebsiteById);

    //PUT Calls
    app.put('/api/website/:wid',updateWebsite);

    //DELETE Calls
    app.delete('/api/website/:wid',deleteWebsite);


    function createWebsite(req, res) {
        var uid = req.params.uid;
        var website = req.body;

        websiteModel
            .createWebsite(uid, website)
            .then(function (website) {
                res.json(website);
            }, function (error) {
                res.send(error);
            });
    }

    function findWebsitesByUser(req, res) {
        var uid = req.params.uid;
        websiteModel
            .findWebsitesByUser(uid)
            .then(function (websites) {
                res.json(websites);
            });
    }

    function findWebsiteById(req, res) {
        var wid = req.params.wid;

        websiteModel
            .findWebsiteById(wid)
            .then(function (website) {
                res.json(website);
            }, function (error) {
                res.status(404).send("The website not found");
            });
    }

    function updateWebsite(req, res) {

        var wid = req.params.wid;
        var website = req.body;

        websiteModel
            .updateWebsite(wid, website)
            .then(function (status) {
                res.send(status);
            });
    }

    function deleteWebsite(req, res) {
        var wid = req.params.wid;
        var uid = req.params.uid;
        websiteModel
            .deleteWebsite(uid, wid)
            .then(function (status) {
                res.send(status);
            });
    }
};