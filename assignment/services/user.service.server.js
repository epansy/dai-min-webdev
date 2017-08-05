module.exports = function(app, models){

    var userModel = models.userModel;

    // get all users
    app.get('/api/user?', findAllUsers);

    // POST Calls.
    app.post('/api/user', createUser);

    // GET Calls.
    app.get('/api/user?username=username', findUserByUsername);
    app.get('/api/user?username=username&password=password', findUserByCredentials);
    app.get('/api/user/:uid', findUserById);

    // PUT Calls.
    app.put('/api/user/:uid', updateUser);

    // DELETE Calls.
    app.delete('/api/user/:uid', deleteUser);

    /*API implementation*/
    function findAllUsers(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        if(username && password) {
            userModel
                .findUserByCredentials(username, password)
                .then(
                    function (user) {
                        if(user) {
                            res.json(user);
                        } else {
                            res.status(404).send("Login credentials not found")
                        }
                    },
                    function (error) {
                        res.sendStatus(404).send(error);
                    }
                );
        } else if (username) {

            userModel
                .findUserByUsername(username)
                .then(
                    function (user) {
                        if(user) {
                            res.json(user);
                        } else {
                            res.status(404).send("Username not found");
                        }
                    },
                    function (error) {
                        res.sendStatus(404).send(error);
                    }
                    );

        } else {
            userModel
                .findAllUsers()
                .then(
                    function (users) {
                        res.json(users);
                    },
                    function (error) {
                        res.sendStatus(404).send(error);
                    }
                    );
        }
    }


    function createUser(req, res) {
        var user = req.body;

        userModel
            .createUser(user)
            .then(
                function (newUser) {
                    res.json(newUser);
                },
                function (error) {
                    res.sendStatus(404).send(error);
                }
            );

    }


    function findUserByCredentials (req, res) {

        var username = req.query.username;
        var password = req.query.password;

        if(username && password) {
            userModel
                .findUserByCredentials(username, password)
                .then(
                    function (user) {
                        if (user) {
                            res.json(user);
                        } else {
                            res.status(404).send("Login credentials not found");
                        }
                    },
                    function (error) {
                        res.sendStatus(404).send(error);
                    }
                );
        } else {
            res.status(404).send("Login credentials not found");
        }
    }

    function findUserByUsername (req, res) {

        var username = req.query.username;

        for (u in users){
            var user = users[u];
            if(user.username === username){
                res.status(200).send(user);
                return;
            }
        }
        res.status(404).send("Not found that user with this username!");
    }

    function findUserById(req, res) {

        var uid = req.params.uid;

        if (uid) {
            userModel
                .findUserById(uid)
                .then(function (user) {
                    if(user) {
                        res.json(user);
                    } else {
                        user = null;
                        res.send(user);
                    }
                }, function (error) {
                    res.status(404).send("Username not found");
                });
        }
    }

    function updateUser(req,res) {
        var uid = req.params.uid;
        var user = req.body;
        userModel
            .updateUser(uid, user)
            .then(
                function (user){
                    res.json(user)
                },
                function (error){
                    res.sendStatus(400).send(error);
                }
            );
    }

    function deleteUser(req,res) {
        var uid = req.params.uid;

        if(uid){
            userModel
                .deleteUser(uid)
                .then(
                    function (status){
                        res.sendStatus(200);
                    },
                    function (error){
                        res.sendStatus(400).send(error);
                    }
                );
        } else{
            res.sendStatus(412);
        }
    }
};