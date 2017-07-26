(function () {
    angular
        .module("WbdvDirective", [])
        .directive("wbdvSortable", wbdvSortable);

    function wbdvSortable($http) {

        function linkFunction(scope, element, attrs) {

            var fullUrl = window.location.href;
            var fullUrlParts = fullUrl.split("/");
            var pageId = fullUrlParts[fullUrlParts.indexOf("page") + 1];

            var start = -1;
            var end = -1;

            $(element).sortable({
                start: function (event, ui) {
                    start = $(ui.item).index();
                    console.log("start:" + start);
                },
                stop: function (event, ui) {
                    end = $(ui.item).index();
                    scope.callback ={
                        start: start,
                        end: end
                    };
                    console.log("end:"+end);

                    var url = "/api/page/" + pageId + "/widget?start=" + start + "&end=" + end;

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