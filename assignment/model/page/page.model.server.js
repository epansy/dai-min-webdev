module.exports = function(mongoose, websiteModel){
    var pageSchema = require('./page.schema.server.js')(mongoose);
    var pageModel = mongoose.model('pageModel', pageSchema);

    var api = {
        'createPage' : createPage,
        'findAllPagesForWebsite' : findAllPagesForWebsite,
        'findPageById' : findPageById,
        'updatePage' : updatePage,
        'deletePage' : deletePage,
        'removeWidgetFromPage' : removeWidgetFromPage,
        'addWidgetToPage' : addWidgetToPage
    };

    return api;


    function createPage(websiteId, page) {
        page._website = websiteId;
        return pageModel.create(page)
            .then(function (page) {
                    return websiteModel
                        .addPageToWebsite(websiteId, page._id);
                });
    }

    function findAllPagesForWebsite(websiteId) {
        return pages = pageModel
            .find({_website: websiteId})
            .populate('_website')
            .exec();
    }

    function findPageById(pageId) {
        return pageModel.findById(pageId);
    }

    function updatePage(pageId, page) {
        return pageModel.update({
            _id : pageId
        }, {
            name: page.name,
            title: page.title,
            description: page.desc
        });
    }

    function deletePage(websiteId, pageId) {
        return pageModel
            .remove({_id: pageId})
            .then(function (status) {
                return websiteModel
                    .removePageFromWebsite(websiteId, pageId);
            });
    }


    function removeWidgetFromPage(pageId, widgetId) {
        pageModel
            .findById(pageId)
            .then(function (page) {
                page.widgets.pull(widgetId);
                page.save();
            }, function (error) {
                console.log(error);
            });
    }

    function addWidgetToPage(pageId, widgetId) {
        return pageModel
            .findById({_id: pageId})
            .then(function (page) {
                page.widgets.push(widgetId);
                return page.save();
            });
    }

};
