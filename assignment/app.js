
module.exports = function(app){

    var mongoose = require('mongoose');

    var models = require("./model/models.server.js")(mongoose);

    require("./services/user.service.server.js")(app, models);
    require("./services/website.service.server.js")(app, models);
    require("./services/page.service.server")(app, models);
    require("./services/widget.service.server")(app, models);
};

console.log("server side app.js is running");