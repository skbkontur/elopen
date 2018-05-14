import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';
import 'angular-ui-bootstrap';

import template from './templates/dashboard.html';

uiRoutes.enable();
uiRoutes.when('/', {
  template: template,
  controller: 'indiesViewHome',
  controllerAs: 'ctrl'
});

class IndicesObj {
  constructor(indexName, indexStatus) {
    this.indexName = indexName;
    this.status = indexStatus;
  }
}

const buildDate = data => {
  const newOrignData = [];
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const obj = new IndicesObj(key, data[key].state);
      newOrignData.push(obj);
    }
  }
  return newOrignData;
};

const extractDate = data => {
  const parts = data.split('-');
  if (parts.length > 1) {
    const date = parts[parts.length - 1];
    const dateParts = date.split('.');
    if (dateParts.length === 2) {
      dateParts.push(1);
    }
    if (dateParts.length === 3) {
      const d = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], 0, 0, 0);
      const formatter = new Intl.DateTimeFormat(['ru', 'en'], {
        month: 'long',
        year: 'numeric'
      });
      const month = formatter.format(d);
      return {
        month: month,
        date: date,
      };
    }
  }
  return undefined;
};

const extractNames = names => {
  const map = {};
  const result = [];
  for (let i = 0; i < names.length; i++) {
    const name = names[i].indexName.replace(/(\d{4}).(\d{2}).(\d{2})/g, '*');
    if (undefined === map[name]) {
      map[name] = true;
      result.push(name);
    }
  }
  return result;
};

uiModules
  .get('app/indies_view', [])
  .controller('indiesViewHome', ($http, $scope, $filter) => {

    // get from api
    $scope.init = () => {
      $http
        .get('../api/elopen/_stats')
        .then((response) => {
          $scope.indices = buildDate(response.data.metadata.indices);
          for (let i = 0; i < $scope.indices.length; i++) {
            const date = extractDate($scope.indices[i].indexName);
            if(date) $scope.indices[i].date = date.date;
          }
          $scope.indices = $filter('orderBy')($scope.indices, 'date', true);
          $scope.names = extractNames($scope.indices);
          $scope.names = $filter('orderBy')($scope.names);
          $scope.searchName($scope.names[0]);
        });
    };
    $scope.init();

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

    // for empty obj
    $scope.checkObj = name => {
      return Object.keys(name).length === 0;
    };

    // give me everything by name
    $scope.searchName = name => {
      if (name[name.length - 1] === '*') {
        const indexSearchName = name.substr(0, name.length - 1);
        const regexp = new RegExp(`${indexSearchName}.*`);
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
