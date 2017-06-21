(function() {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);
    
    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.websites = WebsiteService.findWebsitesByUser(vm.uid);
    }

    function NewWebsiteController($routeParams, $timeout, WebsiteService, $location) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.newWebsite = newWebsite;

        function init() {
            vm.websites = WebsiteService.findWebsitesByUser(vm.uid);
        }
        init();

        function newWebsite(websiteName, websiteDesc) {
            if (websiteName === undefined || websiteName === null) {
                vm.error = "Website name cannot be empty.";
                $timeout(function () {
                    vm.error = null;
                }, 3000);
                return;
            }
            var website = {
                name: websiteName,
                desc: websiteDesc
            };
            var websiteId = WebsiteService.createWebsite(vm.uid, website);
            website = WebsiteService.findWebsiteById(websiteId);
            $location.url("/user/" + vm.uid + "/website");
        }
    }

    function EditWebsiteController($routeParams, $location, $timeout, WebsiteService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;

        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        function init() {
            vm.websites = WebsiteService.findWebsitesByUser(vm.uid);
            vm.website = WebsiteService.findWebsiteById(vm.wid);
        }
        init();

        function updateWebsite() {
            var update_website = {
                _id: $routeParams.wid,
                name: vm.website.name,
                developerId: vm.uid,
                desc: vm.website.desc
            };
            WebsiteService.updateWebsite(vm.wid, update_website);

            vm.updated = "Website changes saved!";

            $timeout(function () {
                vm.updated = null;
            }, 3000);
        }

        function deleteWebsite(websiteId) {
            WebsiteService.deleteWebsite(websiteId);
            $location.url("/user/" + vm.uid + "/website");
        }
    }

})();