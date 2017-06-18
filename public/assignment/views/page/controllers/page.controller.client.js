(function() {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController($routeParams, PageService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pages = PageService.findPageByWebsiteId(vm.wid);
    }

    function NewPageController($routeParams, $timeout, $location, PageService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;

        vm.createPage = createPage;

        function createPage(pageName, pageTitle) {
            if (pageName === undefined || pageName === null) {
                vm.error = "Page name cannot be empty.";
                $timeout(function () {
                    vm.error = null;
                }, 3000);
                return;
            }

            var page = {
                name: pageName,
                description: pageTitle
            };
            PageService.createPage(vm.wid, page);
            $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page");
        }
    }

    function EditPageController($routeParams, $location, PageService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;

        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        function init() {
            vm.page = PageService.findPageById(vm.pid);
        }
        init();

        function updatePage() {
            var update_page = {
                _id: vm.pid,
                name: vm.page.name,
                websiteId: vm.wid,
                description: vm.page.des
            };

            PageService.updatePage(vm.pid, update_page);
            $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page");
        }

        function deletePage(pageId) {
            PageService.deletePage(pageId);
            $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page");
        }
    }
})();