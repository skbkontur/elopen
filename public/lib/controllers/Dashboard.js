
import moment from 'moment';

var module = require('ui/modules').get('apps/elopen', []);

module.controller('Dashboard', function ($scope, $route, $interval, $http) {
    $scope.title = 'Elopen';
    $scope.description = 'Smooth Elasticsearch index opener';

    $scope.openIndex = function(index) {
        openIndex(index, $http)
    };
    $scope.verifyIndex = function(index) {
        verifyIndex(index, $http)
    };
    $scope.closeIndex = function(index) {
        closeIndex(index, $http)
    };

    $http.get('../elasticsearch/_cat/indices?format=json').then((response) => {
        $scope.indices = [];
        var indCache = [];
        for (var i = 0; i < response.data.length; i++) {
            var name = extractName(response.data[i].index);

            if(name!=undefined && indCache[name]!=true) {
                $scope.indices.push(name);
                indCache[name] = true;
            }
        }
    });
    var indexName = $route.current.pathParams.index;
    if(indexName !=undefined) {
        $http.get('../elasticsearch/_cat/indices?'+indexName+'-*&format=json').then((response) => {
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
});

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
        var d = new Date(dateParts[0], dateParts[1], dateParts[2],0,0,0);
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