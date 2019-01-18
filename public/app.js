import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';
import { getShortLIst, checkDate } from './controllers/index';
import 'angular-ui-bootstrap';
import template from './templates/dashboard.html';
import './bootstrap.min.css';

uiRoutes.enable();
uiRoutes.when('/', {
  template: template,
  controller: 'indiesViewHome',
  controllerAs: 'ctrl'
});


uiModules
  .get('app/indies_view', [])
  .controller('indiesViewHome', ($http, $scope, $filter) => {
    // legacy теперь берем из index pattern
    // Брать имя комнды из браузерной строки уровня edi-elk6.skbkontur.ru = edi
    // const commandName = window.location.hostname.match(/\w*(?=-elk*)/)[0];

    // финальный объект данных, нужен для фронта
    $scope.all = {};
    $scope.dates = {};

    const getIndices = searchElkString => {
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
          const validateIndex = checkDate($scope.all[key].index);
          if (validateIndex !== false) {
            if (!result[validateIndex.month]) result[validateIndex.month] = [];
            result[validateIndex.month].push({
              date: validateIndex.date,
              index: $scope.all[key].index,
              status: $scope.all[key].status
            });
          }
        }
      }
      $scope.dates = result;
    };

    $scope.init = () => {
      const data = [];
      $http
        .get(`https://${window.location.hostname}/api/saved_objects/?type=index-pattern&fields=title&per_page=10000`)
        .then(response => {
          for (let i = 0, len = response.data.saved_objects.length; i < len; i++) {
            data.push(response.data.saved_objects[i].attributes.title);
          }
          const findString = data.join(',');

          getIndices(findString)
          .then(res => {
            // список слева, краткий
            $scope.shotlist = getShortLIst(res);
            $scope.shotlist = $filter('orderBy')($scope.shotlist);
            $scope.all = res;
            $scope.all = $filter('orderBy')($scope.all, 'index', true);
          });
        });
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