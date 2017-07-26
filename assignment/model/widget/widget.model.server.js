module.exports = function(mongoose, pageModel) {
    var widgetSchema = require('./widget.schema.server.js')(mongoose);
    var widgetModel = mongoose.model('widgetModel', widgetSchema);

    var api = {
        'createWidget': createWidget,
        'findAllWidgetsForPage': findAllWidgetsForPage,
        'findWidgetById': findWidgetById,
        'updateWidget': updateWidget,
        'deleteWidget': deleteWidget,
        'sortWidget': sortWidget
    };

    return api;

    function sortWidget(pageId, start, end) {

        return pageModel
            .findPageById(pageId)
            .then(function (page) {
                    if (start && end) {
                        page.widgets.splice(end, 0, page.widgets.splice(start, 1)[0]);
                        return page.save();
                    }
                });
    }

    function deleteWidget(pageId, widgetId) {
        //var pageId = widgetModel.findById(widgetId)._page;

        return widgetModel
            .remove({_id: widgetId})
            .then(function (status) {
                return pageModel
                    .removeWidgetFromPage(pageId, widgetId);
            });
    }

    function updateWidget(widgetId, widget) {
        return widgetModel.update({
            _id: widgetId
        }, {
            name: widget.name,
            text: widget.text,
            placeholder: widget.placeholder,
            description: widget.description,
            url: widget.url,
            width: widget.width,
            size: widget.size
        });
    }


    function createWidget(pageId, widget) {
        widget._page = pageId;

        return widgetModel.create(widget)
            .then(function (widget) {
                return pageModel
                    .addWidgetToPage(pageId, widget._id);
            });
    }

    function findAllWidgetsForPage(pageId) {
        return pageModel
            .findPageById(pageId)
            .populate('widgets')
            .then(function (page) {

                    return page.widgets;
                });
    }

    function findWidgetById(widgetId) {
        return widgetModel.findById(widgetId);
    }

};
