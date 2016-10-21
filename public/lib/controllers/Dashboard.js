
import moment from 'moment';

var module = require('ui/modules').get('apps/elopen', []);

module.controller('Dashboard', ['$scope', 'orderByFilter', '$route', '$interval', '$http', function ($scope, orderBy, $route, $interval, $http) {
    $scope.title = 'Elopen';
    $scope.description = 'Elasticsearch index opener';
    var close;

    $scope.openIndex = function(index) {

        // Don't close a new index if we are already closing
        if ( angular.isDefined(close) ) return;

        index.status = 'verifying';
        close = true;
        $http.post("../elasticsearch/"+index.index+"/_open").then((response) => {
            close = $interval(function() {
                var url = '../elasticsearch/_cat/indices/'+index.index+'?format=json';
                $http.get(url).then((response) => {
                    var currentIndex = response.data[0];
                    if(currentIndex.health != 'red') {
                        index.status = currentIndex.status;
                        if (angular.isDefined(close)) {
                            $interval.cancel(close);
                            close = undefined;
                        }
                    }
                });
            }, 2000);
        });
    };

    $scope.indices = extractNames($route.current.locals.indexPatternIds).sort();
    var indexName = $route.current.pathParams.index;
    if(indexName !=undefined) {
        $http.get('../elasticsearch/_cat/indices/'+indexName+'?format=json').then((response) => {
            var indexes = orderBy(response.data, "index", true);
            $scope.indexName = indexName;
            $scope.dates = {};
            for (var i = 0; i < indexes.length; i++) {
                var index = response.data[i]
                var date = extractDate(index.index);
                if(date!=undefined) {
                    if ($scope.dates[date.month] == undefined) {
                        $scope.dates[date.month] = [];
                    }
                    $scope.dates[date.month].push({
                        date: date,
                        index: index,
                    });
                }
            }
        });
    }
}]);

var extractNames = function(names) {
    var map = {};
    var result = [];
    for(var i=0; i<names.length; i++) {
        var name = names[i].replace("[", "").replace("]YYYY.MM.DD", "*");
        if(undefined == map[name]) {
            map[name] = true;
            result.push(name);
        }
    }
    return result;
};


var extractDate = function(el) {
    var parts = el.split('-');
    if(parts.length>1) {
        var date = parts[parts.length - 1];
        var dateParts = date.split('.');
        if(dateParts.length==3) {
            var d = new Date(dateParts[0], dateParts[1]-1, dateParts[2],0,0,0);
            var formatter = new Intl.DateTimeFormat(['ru', 'en'], {
                month: "long",
                year: "numeric",
              });

            var month = formatter.format(d);
            return {
                month: month,
                date: date,
            };
        }
    }
    return undefined;
};
