/**
 * Created by RT on 11/10/16.
 */
(function () {
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);
    function WidgetService() {
        var widgets = [
            {_id: "123", widgetType: "HEADING", pageId: "321", size: 2, name: "GIZZY", text: "GIZMODO"},
            {_id: "234", widgetType: "HEADING", pageId: "100", size: 4, name: "Ippsy", text: "Lorem ipsum"},
            {_id: "345", widgetType: "IMAGE", pageId: "321", name: "Lorem Pixel", text: "Pixel", width: "100%", url: "http://lorempixel.com/400/200/"},
            {_id: "456", widgetType: "HTML", pageId: "321", name: "Ipsy", text: "<p>Lorem ipsum</p>"},
            {_id: "567", widgetType: "HEADING", pageId: "321", size: 4, name: "Lorrro", text: "Lorem ipsum"},
            {_id: "678", widgetType: "YOUTUBE", pageId: "321", name: "Dire Straits", text: "Sultans of Swing", width: "100%", url: "https://www.youtube.com/embed/8Pa9x9fZBtY"},
            {_id: "789", widgetType: "HTML", pageId: "100", name: "Lorem", text: "<p>Lorem ipsum</p>"}
        ];

        var service = {
            "createWidget": createWidget,
            "findWidgetsByPageId": findWidgetsByPageId,
            "findWidgetById": findWidgetById,
            "updateWidget": updateWidget,
            "deleteWidget": deleteWidget,
            "deleteWidgetsByPage": deleteWidgetsByPage
        };
        return service;

        function getNextId() {
            function getMaxId(maxId, currentId) {
                var current = parseInt(currentId._id);
                if (maxId > current) {
                    return maxId;
                } else {
                    return current + 1;
                }
            }
            return widgets.reduce(getMaxId, 0).toString();
        }

        function createHeader(pageId, widget, widgetId) {
            var newHeader = {
                _id: widgetId,
                widgetType: 'HEADING',
                pageId: pageId,
                size: widget.size,
                text: widget.text,
                name: widget.name

            }
            return newHeader;
        }

        function createImage(pageId, widget, widgetId) {
            var newImage = {
                _id: widgetId,
                widgetType: 'IMAGE',
                pageId: pageId,
                name: widget.name,
                width: widget.width,
                url: widget.url
            }
            return newImage;
        }

        function createYouTube(pageId, widget, widgetId) {
            var newYouTube = {
                _id: widgetId,
                widgetType: 'YOUTUBE',
                pageId: pageId,
                name: widget.name,
                width: widget.width,
                url: widget.url
            }
            return newYouTube;
        }


        function createWidget(pageId, widget) {
            var newWidgetId = getNextId();
            var newWidget = null;
            if(widget.widgetType === 'HEADING') {
                newWidget = createHeader(pageId, widget, newWidgetId);
            } else if(widget.widgetType === 'IMAGE') {
                newWidget = createImage(pageId, widget, newWidgetId);
            } else if(widget.widgetType === 'YOUTUBE') {
                newWidget = createYouTube(pageId, widget, newWidgetId);
            }

            if(newWidget !== null) {
                widgets.push(newWidget);
            }

        }


        function findWidgetsByPageId(pageId) {
            results = [];
            for (w in widgets) {
                var widget = widgets[w];
                if (parseInt(widget.pageId) === parseInt(pageId)) {
                    result.push(widget);
                }
            }
            return result;
        }

        function findWidgetById(widgetId) {
            for (wid in widgets) {
                var widget = widgets[wid];
                if (widget._id === widgetId) {
                    return widget;
                }
            }
            return null;
        }

        function updateWidget(widgetId, widget) {
            var oldWidget = findWidgetById(widgetId);
            var index = widgets.indexOf(oldWidget);
            var type = oldWidget.widgetType;
            if(type === 'HEADING') {
                widgets[index].name = widget.name;
                widgets[index].text = widget.text;
                widgets[index].size = widget.size;
            } else if(type === 'IMAGE') {
                widgets[index].name = widget.name;
                widgets[index].text = widget.text;
                widgets[index].url = widget.url;
                widgets[index].width = widget.width;
            } else if(type === 'YOUTUBE') {
                widgets[index].name = widget.name;
                widgets[index].text = widget.text;
                widgets[index].url = widget.url;
                widgets[index].width = widget.width;
            }
        }

        function deleteWidget(widgetId) {
            var oldWidget = findWidgetById(widgetId);
            var index = widgets.indexOf(oldWidget);
            widgets.splice(index, 1);
        }

        function deleteWidgetsByPage(pageId) {
            for (wid in widgets) {
                var widget = widgets[wid];
                if (widget.pageId === pageId) {
                    deleteWidget(widget._id);
                }
            }
        }
    }
})();