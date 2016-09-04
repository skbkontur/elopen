
import moment from 'moment';

var module = require('ui/modules').get('apps/elopen', []);

module.controller('Index', function ($scope, $route, $interval, $http) {
    $scope.title = 'Elopen';
    $scope.description = 'Smooth Elasticsearch index opener';

    $http.get('../elasticsearch/_cat/indices?format=json').then((response) => {
        $scope.indices = [];
        $scope.dates = [];
        var indCache = [];
        for (var i = 0; i < response.data.length; i++) {
            var parts = response.data[i].index.split('-');
            if(parts.length>1) {
                var name = parts.slice(0, -1).join('-');
                var date = parts[parts.length-1];

                if(indCache[name]!=true) {
                    $scope.indices.push(name);
                    indCache[name] = true;
                }

                if($scope.dates[name] == undefined) {
                    $scope.dates[name] = [];
                }
                $scope.dates[name].push(date);
            }
        }
        debugger;
      });
});
