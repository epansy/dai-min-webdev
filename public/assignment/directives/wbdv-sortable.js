(function () {
    angular
        .module("WbdvDirective", [])
        .directive("wbdvSortable", wbdvSortable);

    function wbdvSortable($http) {

        function linkFunction(scope, element, attrs) {
            // get the pageId of the widgets list
            var fullUrl = window.location.href;
            var fullUrlParts = fullUrl.split("/");
            var pageId = fullUrlParts[fullUrlParts.indexOf("page") + 1];
            $(element).sortable({
                start: function (event, ui) {
                    start = $(ui.item).index();
                    // console.log("start:" + start);
                },
                stop: function (event, ui) {
                    end = $(ui.item).index();
                    scope.callback ={
                        start: start,
                        end: end
                    };
                    // console.log("end:"+end);
                    // get the url to send to server
                    var url = "/api/page/" + pageId + "/widget?initial=" + start + "&final=" + end;
                    // change the widgets order in server
                    $http.put(url);

                }
            });

        }

        return{
            link: linkFunction,
            callback: '&'
        }
    }

})();