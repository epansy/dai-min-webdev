module.exports = function(app){

    var users = [
        {_id: "123", username: "alice", password: "alice", firstName: "Alice", lastName: "Wonder", email: "alice@gmail.com"},
        {_id: "100", username: "a", password: "a", firstName: "a", lastName: "a", email: "a@gmail.com"},
        {_id: "234", username: "bob", password: "bob", firstName: "Bob", lastName: "Marley", email: "bob@regge.com"},
        {_id: "345", username: "charly", password: "charly", firstName: "Charly", lastName: "Garcia", email: "charles@bing.com"},
        {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose", lastName: "Annunzi", email: "jose@neu.com"}
    ];

    // get all users
    app.get('/api/user?', findAllUsers);

    // POST Calls.
    app.post('/api/user', createUsers);

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
        if (username && password) {
            for (var u in users) {
                var user = users[u];
                if (user.username === username && user.password === password) {
                    res.send(user);
                    return;
                }
            }
            res.sendStatus(404);
            return;
        } else if (username) {
            for (var u in users) {
                var user = users[u];
                if (user.username === username) {
                    res.send(user);
                    return;
                }
            }
            res.sendStatus(404);
            return;
        } else {
            res.send(users);
        }
    }


    function createUsers(req, res) {
        var user = req.body;

        var newUser = {
            _id: new Date().getTime(),
            username: user.username,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };
        users.push(newUser);

        res.send(newUser);

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

    function findUserByCredentials (req, res) {

        var username = req.query.username;
        var pswd = req.query.password;

        for (u in users){
            var user = users[u];
            if(user.username === username && user.password === pswd){
                res.status(200).send(user);
                return;
            }
        }
        res.status(404).send("Not found that user by credentials!");

    }

    function findUserById(req, res) {

        var uid = req.params.uid;

        for (u in users){
            var user = users[u];
            if(String(user._id) === String(uid)) {
                res.status(200).send(user);
                return;
            }
        }
        res.status(404).send("That user was not found by ID!");
    }

    function updateUser(req,res) {
        var uid = req.params.uid;
        var new_user = req.body;
        for (var u in users){
            if(String(users[u]._id) === String(uid)) {
                users[u] = new_user;
                res.sendStatus(200);
                return;
            }
        }
        res.status(404).send("Not found the user you want to update!");
    }

    function deleteUser(req,res) {
        var uid = req.params.uid;
        var user = req.body;

        for (u in users){
            if(String(users[u]._id) === String(uid)){
                users.splice(u,1);
                res.sendStatus(200);
                return;
            }
        }
        res.status(404).send("Not found the user to delete!");
    }
};