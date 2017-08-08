
module.exports = function(mongoose) {
    var connectionString =  null;

    if (process.env.MONGODB_URI) {
        connectionString = 'mongodb://<admin>:<15926>@ds137141.mlab.com:37141/heroku_xd08mp2p';
    }
    else
    {
        connectionString = 'mongodb://localhost:27017/cs5610-webdev'
    }

    mongoose.connect(connectionString, {
        useMongoClient: true
    });
    mongoose.Promise = require('q').Promise;

    var userModel = require("./user/user.model.server.js")(mongoose);
    var websiteModel = require("./website/website.model.server.js")(mongoose, userModel);
    var pageModel =  require("./page/page.model.server.js")(mongoose, websiteModel);
    var widgetModel = require("./widget/widget.model.server.js")(mongoose, pageModel);

    var models = {
        'userModel' : userModel,
        'websiteModel' : websiteModel,
        'pageModel' : pageModel,
        'widgetModel' : widgetModel
    };

    return models;
};

console.log("models.server.js is running");

