module.exports = function(app, models){

    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/assignment/uploads' });

    var model = models.widgetModel;

    // POST call
    app.post("/api/page/:pid/widget", createWidget);

    // GET call
    app.get("/api/page/:pid/widget", findAllWidgetsForPage);
    app.get("/api/widget/:wgid", findWidgetById);

    // PUT call
    app.put("/api/widget/:wgid", updateWidget);

    // DELETE call
    app.delete("/api/page/:pid/widget/:wgid", deleteWidget);

    // upload image
    app.post ("/api/upload", upload.single('myFile'), uploadImage);

    // reorder widget list
    app.put("/api/page/:pid/widget", reorderWidgets);

    // api implementation

    function createWidget(req, res) {
        var pid = req.params.pid;
        var widget = req.body;

        model
            .createWidget(pid, widget)
            .then(
                function (widget) {
                    if(widget){
                        res.json(widget);
                    } else {
                        widget = null;
                        res.send(widget);
                    }
                }
                ,
                function (error) {
                    res.sendStatus(400).send("widget service server, createWidget error");
                }
            )
    }

    function findAllWidgetsForPage(req, res) {
        var pid = req.params.pid;

        model
            .findAllWidgetsForPage(pid)
            .then(
                function (widgets) {
                    // console.log(widgets);
                    if(widgets) {
                        res.json(widgets);
                    } else {
                        widgets = null;
                        res.send(widgets);
                    }
                }, function (error) {
                    res.sendStatus(400).send("widget service server, findAllWidgetsForPage error");
                }
            )
    }

    function findWidgetById(req, res) {
        var wgid = req.params.wgid;
        // console.log("in findWidgetById")

        model
            .findWidgetById(wgid)
            .then(
                function (widget) {
                    if (widget) {
                        res.json(widget);
                    } else {
                        widget = null;
                        res.send(widget);
                    }
                },
                function (error) {
                    res.sendStatus(400).send("widget service server, findWidgetById error");
                }
            );

    }

    function updateWidget(req, res) {

        var wgid = req.params.wgid;
        var widget = req.body;

        model
            .updateWidget(wgid, widget)
            .then(
                function (widget) {
                    res.json(widget);
                },
                function (error) {
                    res.status(400).send("widget service server, updateWidget error");
                }
            );

    }

    function deleteWidget(req, res) {
        var pid = req.params.pid;
        var wgid = req.params.wgid;

        if(wgid){
            model
                .deleteWidget(pid, wgid)
                .then(
                    function (status){
                        res.sendStatus(200);
                    },
                    function (error){
                        res.sendStatus(400).send(error);
                    }
                );
        } else{
            // Precondition Failed. Precondition is that the user exists.
            res.sendStatus(412);
        }

    }

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

        // widget = getWidgetById(widgetId);
        var url = 'uploads/'+filename;

        // when try to create a new image
        if (widgetId === undefined || widgetId === null || widgetId === '') {
            var widget = {
                widgetType: "IMAGE",
                url: url,
                width: width
            };

            model
                .createWidget(pageId, widget)
                .then(
                    function (widget) {
                        // console.log(widget);
                        if(widget){
                            // console.log("in if branch");
                            res.json(widget);
                            // console.log("touch");
                            // res.send(200);
                        } else {
                            // console.log("in else branch");
                            widget = null;
                            res.send(widget);
                        }
                    }
                    ,
                    function (error) {
                        // console.log("in error branch");
                        res.sendStatus(400).send("widget service server, upload error");
                    }
                )
        } else {
            // when trying to edit existing image
            model
                .findWidgetById(widgetId)
                .then(
                    function (widget) {
                        widget.url = url;
                        model.updateWidget(widgetId, widget)
                            .then(
                                function (widget) {
                                    res.json(widget);
                                },
                                function (error) {
                                    res.status(400).send("widget service server, updateWidget error");
                                }
                            )
                    },
                    function (error) {
                        res.status(400).send("Cannot find widget by id");
                    }
                )

        }

        var callbackUrl  = "/#!/website/"+websiteId+"/page/"+pageId+"/widget";
        res.redirect(callbackUrl);
    }

    function reorderWidgets(req, res) {
        // get widgets by pageId
        var pageId = req.params.pid;


        // index1 and index2 are index in pageWidgets
        var index1 = req.query.initial;
        var index2 = req.query.final;
        // console.log("in service: " + index1 + " " + index2);

        model
            .reorderWidget(pageId, index1, index2)
            .then(
                function (page) {
                    // console.log("in service");
                    // console.log(page.widgets);
                    res.sendStatus(202);
                },
                function (error) {
                    res.status(400).send("Cannot reorder widgets");
                }
            )
    }

};