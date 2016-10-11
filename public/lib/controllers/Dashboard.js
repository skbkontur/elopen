
import moment from 'moment';

var module = require('ui/modules').get('apps/elopen', []);

module.controller('Dashboard', ['$scope', 'orderByFilter', '$route', '$interval', '$http', function ($scope, orderBy, $route, $interval, $http) {
    $scope.title = 'Elopen';
    $scope.description = 'Elasticsearch index opener';
    var close;
    $scope.openIndex = function(index) {

        openIndex(index, $http);
        // Don't close a new index if we are already closing
        if ( angular.isDefined(close) ) return;

        close = $interval(function() {
            var url = '../elasticsearch/_cat/indices/'+index.index+'?format=json';
            $http.get(url).then((response) => {
                if(response.data[0].health != 'red') {
                    index.status = response.data[0].status;
                    if (angular.isDefined(close)) {
                        $interval.cancel(close);
                        close = undefined;
                    }
                }
            });
        }, 2);
    };

    $scope.verifyIndex = function(index) {
        verifyIndex(index, $http)
    };
    $scope.closeIndex = function(index) {
        closeIndex(index, $http)
    };

    $scope.indices = $route.current.locals.indexPatternIds;
    var indexName = $route.current.pathParams.index;
    if(indexName !=undefined) {
        $http.get('../elasticsearch/_cat/indices/'+indexName+'?format=json').then((response) => {
            response.data = orderBy(response.data, "index", true);
            $scope.indexName = indexName;
            $scope.dates = {};
            for (var i = 0; i < response.data.length; i++) {
                var date = extractDate(response.data[i].index);
                if(date!=undefined) {
                    if ($scope.dates[date.month] == undefined) {
                        $scope.dates[date.month] = [];
                    }
                    $scope.dates[date.month].push({
                        date: date,
                        index: response.data[i],
                    });
                }
            }
        });
    }
}]);

var openIndex = function(index, http) {
    http.post("../elasticsearch/"+index.index+"/_open").then((response) => {
        index.status = 'verifying';
    });
};

var verifyIndex = function(index, http) {
    index.status = 'open';
};

var closeIndex = function(index, http) {
    http.post("../elasticsearch/"+index.index+"/_close").then((response) => {
        index.status = 'close';
    });
};



var extractName = function(el) {
    var parts = el.split('-');
    if(parts.length>1) {
        name = parts.slice(0, -1).join('-');
        return name;
    }
    return undefined;
};


var extractDate = function(el) {
    var parts = el.split('-');
    if(parts.length>1) {
        var date = parts[parts.length - 1];
        var dateParts = date.split('.');
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
    return undefined;
};
