module.exports = function(mongoose, userModel) {
    var websiteSchema = require('./website.schema.server.js')(mongoose);
    var websiteModel = mongoose.model('websiteModel', websiteSchema);

    var api = {
        'createWebsite': createWebsite,
        'findWebsitesByUser': findWebsitesByUser,
        'findAllWebsites' : findAllWebsites,
        'findWebsiteById': findWebsiteById,
        'updateWebsite': updateWebsite,
        'removePageFromWebsite': removePageFromWebsite,
        'addPageToWebsite' : addPageToWebsite,
        'deleteWebsite': deleteWebsite
    };
    return api;

    function removePageFromWebsite(websiteId, pageId) {
        websiteModel
            .findById({_id: websiteId})
            .then(function(website) {
                var index = website.pages.indexOf(websiteId);
                website.pages.splice(index, 1);
                return website.save();
                },
                function(error){
                    console.log(error);
                }
            );
    }

    function addPageToWebsite(websiteId, pageId) {
        return websiteModel
            .findById({_id: websiteId})
            .then(function (website) {
                website.pages.push(pageId);
                return website.save();
            });
    }

    function findAllWebsites() {
        return websiteModel.find();
    }

    function createWebsite(userId, website) {
        website._user = userId;
        return websiteModel
            .create(website)
            .then(
                function (website) {
                    return userModel
                        .addWebsiteForUser(userId, website._id)
                });
    }

    function findWebsitesByUser(userId) {
        return websiteModel
            .find({_user: userId})
            .populate('_user')
            .exec();
    }


    function findWebsiteById(websiteId) {
        return websiteModel.findOne({_id: websiteId});
    }

    function updateWebsite(websiteId, website) {
        return websiteModel.update({
            _id : websiteId
        }, {
            name: website.name,
            description: website.description
        });
    }

    function deleteWebsite(userId, websiteId) {
        //var userId = websiteModel.findOne({_id: websiteId})._user;

        return websiteModel
            .remove({_id: websiteId})
            .then(function (status) {
                return userModel
                    .removeWebsiteFromUser(userId, websiteId);
            });
    }

};