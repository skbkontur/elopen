import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';
import { getShortLIst, checkDate } from './controllers/index';
import 'angular-ui-bootstrap';
import * as data from '../dictionary.js';

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
    // Брать имя комнды из браузерной строки уровня edi-elk6.skbkontur.ru = edi
    const commandName = window.location.hostname.match(/\w*(?=-elk*)/)[0];
    // финальный объект данных, нужен для фронта
    $scope.all = {};
    $scope.dates = {};

    // entry point вход для единоразового получения всех индексов
    const getIndices = dictionary => {
      let searchElkString = '';
      dictionary.push(commandName);
      for (let i = 0; i < dictionary.length; i++) {
        searchElkString += `${dictionary[i]}*,`;
        searchElkString += `stacktracejs-report-*${dictionary[i]}*,`;
      }
      // Возвращает все найденные по этой строке индексы
      return new Promise((res, rej) => {
        $http
          .get(`../api/elopen/${searchElkString}/_stats`)
          .then(response => res(response.data))
          .catch(err => rej(err));
      });
    };

    $scope.filterName = name => {
      const result = {};
      for (const key in $scope.all) {
        if ($scope.all[key].index.match(name)) {
          const da = checkDate($scope.all[key].index);
          if (da !== false) {
            if (!result[da.month]) result[da.month] = [];
            result[da.month].push({
              date: da.date,
              index: $scope.all[key].index,
              status: $scope.all[key].status
            });
          }
        }
      }
      // console.log(result);
      $scope.dates = result;
    };

    $scope.init = () => {
      // есть в словаре
      if (data[commandName]) {
        getIndices(data[commandName])
          .then(res => {
            // список слева, краткий
            $scope.shotlist = getShortLIst(res);
            $scope.shotlist = $filter('orderBy')($scope.shotlist);
            $scope.all = res;
            $scope.all = $filter('orderBy')($scope.all, 'index', true);
          });
        // нет в словаре
      } else {
        getIndices([])
          .then(res => {
            $scope.shotlist = getShortLIst(res);
            $scope.shotlist = $filter('orderBy')($scope.shotlist);
            $scope.all = res;
            $scope.all = $filter('orderBy')($scope.all, 'index', true);
          });
      }
    };

    // я пока не представляю что там не успевает отгрузится - но пока только так.
    $scope.init();
    $scope.init();

    // Для пустых темлейтов, нужен для шаблона html
    $scope.checkObj = name => {
      return Object.keys(name).length === 0;
    };

    $scope.openCurrentIndex = indexName => {
      indexName.status = 'verifying';
      $http
        .get(`../api/elopen/index/${indexName.index}/_open`)
        .then((response) => {
          if (response.status === 200) {
            indexName.status = 'open';
          } else {
            indexName.status = 'error';
          }
        });
    };

    $scope.closeCurrentIndex = indexName => {
      indexName.status = 'verifying';
      $http
        .get(`../api/elopen/index/${indexName.index}/_close`)
        .then((response) => {
          if (response.status === 200) {
            indexName.status = 'close';
          } else {
            indexName.status = 'error';
          }
        });
    };
  });