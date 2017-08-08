module.exports = function(app, models){


    var model = models.websiteModel;

    //POST Calls
    app.post('/api/user/:uid/website',createWebsite);

    //GET Calls
    app.get('/api/user/:uid/website',findAllWebsitesForUser);
    app.get('/api/website/:wid',findWebsiteById);

    //PUT Calls
    app.put('/api/website/:wid',updateWebsite);

    //DELETE Calls
    app.delete('/api/user/:uid/website/:wid',deleteWebsite);


    /*API calls implementation*/
    function createWebsite(req, res) {
        var uid = req.params.uid;
        var website = req.body;


        model
            .createWebsiteForUser(uid, website)
            .then(
                function (website) {
                    if(website){
                        // console.log("in if branch");
                        res.json(website);
                        // res.send(200);
                    } else {
                        // console.log("in else branch");
                        website = null;
                        res.send(website);
                    }
                }
                ,
                function (error) {
                    // console.log("in error branch");
                    res.sendStatus(400).send("website service server, createWebsiteForUser error");
                }
            )

    }

    function findAllWebsitesForUser(req, res) {
        var uid = req.params.uid;
        // console.log("in service: " + uid);

        model
            .findAllWebsitesForUser(uid)
            .then(
                function (websites) {
                    // console.log("in service: " + websites);
                    if(websites) {
                        res.json(websites);
                    } else {
                        websites = null;
                        res.send(websites);
                    }
                },
                function (error) {
                    res.sendStatus(400).send("website service server, findAllWebsitesForUser error");
                }
            )

    }

    function findWebsiteById(req, res) {
        var wid = req.params.wid;

        model
            .findWebsiteById(wid)
            .then(
                function (website) {
                    if(website) {
                        res.json(website);
                    } else {
                        website = null;
                        res.send(website);
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )


    }

    function updateWebsite(req, res) {

        var wid = req.params.wid;
        var website = req.body;

        model
            .updateWebsite(wid, website)
            .then(
                function (website){
                    res.json(website)
                },
                function (error){
                    res.sendStatus(400).send("website service server, updateWebsite error");
                }
            );

    }

    function deleteWebsite(req, res) {
        var uid = req.params.uid;
        var wid = req.params.wid;

        if(wid){
            model
                .deleteWebsite(uid, wid)
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