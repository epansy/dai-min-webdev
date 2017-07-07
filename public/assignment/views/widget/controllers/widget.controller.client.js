(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("CreateWidgetController", CreateWidgetController)
        .controller("EditWidgetController", EditWidgetController);

    function WidgetListController($routeParams, $sce, WidgetService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        WidgetService
            .findWidgetsByPageId(vm.pid)
            .then(renderWidgets);

        function renderWidgets(widgets) {
            vm.widgets = widgets;
        }

        vm.trustThisContent = trustThisContent;
        vm.getYoutubeEmbedUrl = getYoutubeEmbedUrl;

        function trustThisContent(html) {
            return $sce.trustAsHtml(html);
        }

        function getYoutubeEmbedUrl(youtubeLink) {
            var embedUrl = "https://www.youtube.com/embed/";
            var youtubeLinkParts = youtubeLink.split('/');
            var id = youtubeLinkParts[youtubeLinkParts.length - 1];
            embedUrl += id;
            return $sce.trustAsResourceUrl(embedUrl);
        }
    }

    function NewWidgetController($routeParams, $timeout, WidgetService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        vm.widgets = WidgetService.findWidgetsByPageId(vm.pid);
    }

    function CreateWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        vm.widgetType = $routeParams.widgetType;
        vm.createWidget = createWidget;
        vm.createError = null;


        function createWidget(size, width, text, url) {
            if (vm.widgetType === 'IMAGE' || vm.widgetType === 'YOUTUBE') {
                if (url === null || url === undefined) {
                    vm.error = "Url is required for Image/Youtube";
                    return;
                }
            }
            if (vm.widgetType === 'HEADING') {
                if (text === null || text === undefined) {
                    vm.error = "Text is required for Header";
                    return;
                }
            }
            var newWidget = {
                name: vm.widget.name,
                widgetType: vm.widgetType,
                size: size,
                width: width,
                text: text,
                url: url
            };
            WidgetService
                .createWidget(vm.pid, newWidget)
                .then(function () {
                    $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget");
                });
        }
    }

    function EditWidgetController($routeParams, $location, WidgetService, $timeout) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        vm.wgid = $routeParams.wgid;
        WidgetService
            .findWidgetById(vm.wgid)
            .then(function (widget) {
                vm.widget = widget;
            }, function (error) {
                vm.error = "Cannot find this widget by id";
                $timeout(function () {
                    vm.error = null;
                }, 3000);
            });
        vm.updatewidget = updateWidget;
        vm.deleteWidget = deleteWidget;

        function updateWidget(newWidget) {
            WidgetService
                .updateWidget(vm.wgid, newWidget)
                .then(function () {
                    $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget");
                }, function (error) {
                    vm.error = "Cannot find widget to update.";
                    $timeout(function () {
                        vm.error = null;
                    }, 3000);
                });
        }

        function deleteWidget(widget) {
            WidgetService
                .deleteWidget(widget._id)
                .then(function () {
                    $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget");
                }, function (error) {
                    vm.error = "Cannot find widget to delete.";
                    $timeout(function () {
                        vm.error = null;
                    }, 3000);
                })
        }

    }
})();