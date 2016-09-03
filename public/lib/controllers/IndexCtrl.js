
import moment from 'moment';

var module = require('ui/modules').get('apps/elopen', []);

module.controller('IndexCtrl', function ($scope, $route, $interval) {
    $scope.title = 'Elopen';
    $scope.description = 'Smooth Elasticsearch index opener';

    var currentTime = moment($route.current.locals.currentTime);
    $scope.currentTime = currentTime.format('HH:mm:ss');

    var unsubscribe = $interval(function () {
        $scope.currentTime = currentTime.add(1, 'second').format('HH:mm:ss');
    }, 1000);

    $scope.$watch('$destroy', unsubscribe);
});