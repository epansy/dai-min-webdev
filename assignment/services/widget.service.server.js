module.exports = function(app, models){

    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/assignment/uploads' });

    var widgetModel = models.widgetModel;

    // POST call
    app.post("/api/page/:pid/widget", createWidget);

    // GET call
    app.get("/api/page/:pid/widget", findAllWidgetsForPage);
    app.get("/api/widget/:wgid", findWidgetById);

    // PUT call
    app.put("/api/widget/:wgid", updateWidget);

    // DELETE call
    app.delete("/api/widget/:wgid", deleteWidget);

    // upload image
    app.post ("/api/upload", upload.single('myFile'), uploadImage);

    // reorder widget list
    app.put("/api/page/:pid/widget", reorderWidgets);

    // api implementation

    function createWidget(req, res) {
        var pid = req.params.pid;
        var widget = req.body;

        widgetModel
            .createWidget(pid, widget)
            .then(function (widget) {
                res.json(widget);
            }, function (error) {
                res.send(error);
            });
    }

    function findAllWidgetsForPage(req, res) {
        var pid = req.params.pid;
        widgetModel
            .findAllWidgetsForPage(pid)
            .then(function (widgets) {
                res.json(widgets);
            }, function (error) {
                res.send(error);
            });
    }

    function findWidgetById(req, res) {
        var wgid = req.params.wgid;

        widgetModel
            .findWidgetById(wgid)
            .then(function (widget) {
                res.json(widget);
            }, function (error) {
                res.send(error);
            });
    }

    function updateWidget(req, res) {

        var wgid = req.params.wgid;
        var widget = req.body;
        widgetModel
            .updateWidget(wgid, widget)
            .then(function (widget) {
                res.json(widget);
            }, function (status) {
                res.send(status);
            });
    }

    function deleteWidget(req, res) {
        var wgid = req.params.wgid;
        widgetModel
            .deleteWidget(pid, wgid)
            .then(function (status) {
                res.send(status);
            });
    }

    app.post ("/api/upload", upload.single('myFile'), uploadImage);
    function uploadImage(req, res) {

        var widgetId      = req.body.widgetId;
        var width         = req.body.width;

        var myFile        = req.file;

        var userId = req.body.userId;
        var websiteId = req.body.websiteId;
        var pageId = req.body.pageId;

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        widget = getWidgetById(widgetId);
        widget.url = '/uploads/'+filename;

        function getWidgetById(widgetId) {

            // when try to create a new image
            if (widgetId === undefined || widgetId === null || widgetId === '') {
                console.log("come into the correct loop");
                // create a new widget, add to widgets
                var newWidget = {
                    _id: new Date().getTime(),
                    widgetType: "IMAGE",
                    pageId: pageId,
                    width: width
                };
                widgets.push(newWidget);
                return newWidget;
            }

            // edit existing image
            for (w in widgets) {
                var widget = widgets[w];
                if (String(widget._id) === String(widgetId)) {
                    return widget;
                }
            }

            return null;
        }

        var callbackUrl  = "/#!/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget";
        res.redirect(callbackUrl);
    }

    function reorderWidgets(req, res) {
        var pid = req.params.pid;

        var index1 = req.query.start;
        var index2 = req.query.end;

        widgetModel
            .reorderWidgets(pid, index1, index2)
            .then(function (status) {
                res.send(status);
            });

    }

};