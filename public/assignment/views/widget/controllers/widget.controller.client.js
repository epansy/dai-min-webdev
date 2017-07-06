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
        vm.widgets = WidgetService.findWidgetsByPageId(vm.pid);

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
        vm.futureFeature = futureFeature;
        vm.featureMissingAlert = null;
    }

    function CreateWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        vm.widgetType = $routeParams.widgetType;
        vm.createWidget = createWidget;
        vm.createError = null;


        function createWidget(name, text, url, size, width) {
            if (vm.widgetType === "IMAGE" || vm.widgetType === "YOUTUBE") {
                if (url === null || url === undefined) {
                    vm.createError = "Url is required for Image/Youtube";
                    return;
                }
            }
            if (vm.widgetType === "HEADING") {
                if (text === null || text === undefined) {
                    vm.createError = "Text is required for Header";
                    return;
                }
            }
            var newWidget = {
                name: name,
                text: text,
                widgetType: vm.widgetType,
                size: size,
                width: width,
                url: url
            };
            WidgetService.createWidget(vm.pid, newWidget);
            $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget");
        }
    }

    function EditWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        vm.wgid = $routeParams.wgid;
        vm.widget = WidgetService.findWidgetById(vm.wgid);
        vm.updatewidget = updateWidget;
        vm.deleteWidget = deleteWidget;

        function updateWidget() {
            var latestData = {
                _id: vm.wgid,
                widgetType: vm.widget.widgetType,
                pageId: vm.widget.pageId,
                size: vm.widget.size,
                text: vm.widget.text,
                width: vm.widget.width,
                url: vm.widget.url
            };
            WidgetService.updateWidget(vm.wgid, latestData);
            $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget");
        }

        function deleteWidget() {
            WidgetService.deleteWidget(vm.wgid);
            $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget");
        }

    }
})();