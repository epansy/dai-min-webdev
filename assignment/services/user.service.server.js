module.exports = function(app, models){

    var userModel = models.userModel;

    // get all users
    app.get('/api/user?', findAllUsers);

    // POST Calls.
    app.post('/api/user', createUser);

    // GET Calls.
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
                .then(function (user) {
                    if(user) {
                        res.json(user);
                    } else {
                        res.status(404).send("Login credentials not found")
                    }
                });
        } else if (username) {

            userModel
                .findUserByUsername(username)
                .then(function (user) {
                    if(user) {
                        res.json(user);
                    } else {
                        res.status(404).send("Username not found");
                    }

                });

        } else {
            userModel
                .findAllUsers()
                .then(function (users) {
                    res.json(users);
                });
        }
    }


    function createUser(req, res) {
        var user = req.body;

        userModel
            .createUser(user)
            .then(function (user) {
                res.json(user);
            }, function (error) {
                res.send(error);
            });

    }


    function findUserByCredentials (req, res) {

        var username = req.query.username;
        var password = req.query.password;

        if(username && password) {
            userModel
                .findUserByCredentials(username, password)
                .then(function (user) {
                    if (user) {
                        res.json(user);
                    } else {
                        res.status(404).send("Login credentials not found");
                    }
                });
        } else {
            res.status(404).send("Login credentials not found");
        }
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
            .then(function (status) {
                res.send(status);
            });
    }

    function deleteUser(req,res) {
        var uid = req.params.uid;

        userModel
            .deleteUser(uid)
            .then(function (status) {
                res.send(status);
            });
    }
};