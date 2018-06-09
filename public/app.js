import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';
import 'angular-ui-bootstrap';
import { buildDate, extractDate, extractNames } from './controllers';

import template from './templates/dashboard.html';

uiRoutes.enable();
uiRoutes.when('/', {
  template: template,
  controller: 'indiesViewHome',
  controllerAs: 'ctrl'
});

uiModules
  .get('app/indies_view', [])
  .controller('indiesViewHome', ($http, $scope, $filter) => {
    const commandName = window.location.hostname.match(/\w*(?=-elk*)/)[0];

    $scope.init = () => {
      $http
        .get('../api/elopen/_stats')
        .then((response) => {
          $scope.indices = buildDate(response.data, commandName);
          for (let i = 0; i < $scope.indices.length; i++) {
            // Игнорим автосозданные триггер индексы
            if ($scope.indices[i].indexName[0] !== '.') {
              const date = extractDate($scope.indices[i].indexName);
              if(date) $scope.indices[i].date = date.date;
            }
          }
          $scope.indices = $filter('orderBy')($scope.indices, 'date', true);
          $scope.names = extractNames($scope.indices);
          $scope.names = $filter('orderBy')($scope.names);
          $scope.searchName($scope.names[0]);
        });
    };
    $scope.init();

    // for empty obj
    $scope.checkObj = name => {
      return Object.keys(name).length === 0;
    };

    $scope.openCurrentIndex = indexName => {
      indexName.status = 'verifying';
      $http
        .get(`../api/elopen/index/${indexName.name}/_open`)
        .then((response) => {
          if (response.status === 200) {
            indexName.status = 'open';
          }
          else {
            indexName.status = 'error';
            console.log('Error with elasticsearch on open index');
          }
        });
      setTimeout($scope.init, 1000);
    };

    // search index by name (regexp)
    $scope.searchName = name => {
      if (name[name.length - 1] === '*') {
        const indexSearchName = name.substr(0, name.length - 1);
        console.log(indexSearchName);
        const regexp = new RegExp(`^${indexSearchName}\\d{4}.\\d{2}.\\d{2}`);
        console.log(regexp);
        $scope.dates = {};
        for (let i = 0; i < $scope.indices.length; i++) {
          if($scope.indices[i].indexName.match(regexp)) {
            const index = $scope.indices[i].indexName;
            const status = $scope.indices[i].status;
            const date = extractDate($scope.indices[i].indexName);
            if (date !== undefined) {
              if ($scope.dates[date.month] === undefined) {
                $scope.dates[date.month] = [];
              }
              $scope.dates[date.month].push({
                date: date.date,
                index: {
                  name: index,
                  status: status
                }
              });
            }
          }
        }
      }
      else {
        $scope.dates = {};
      }
    };

  });
