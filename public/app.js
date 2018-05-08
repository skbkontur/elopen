import {uiModules} from 'ui/modules';
import uiRoutes from 'ui/routes';
import 'angular-ui-bootstrap';
import 'ui/autoload/styles';
import './less/main.less';

// import template from './templates/index.html';
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

// сборка данных с сервера в единый массив
const buildDate = orignData => {
  const newOrignData = [];
  for (const key in orignData) {
    if (orignData.hasOwnProperty(key)) {
      const obj = new IndicesObj(key, orignData[key].state);
      newOrignData.push(obj);
    }
  }
  return newOrignData;
};

const buildIndexes = originDate => {
  const result = [];
  for (const item in originDate) {
    if (originDate.hasOwnProperty(item)) {
      // let tempResult = originDate[item].indexName.match(/.*(?=\d{4}\.\d{2}\.\d{2})/gi);
      // if (result.indexOf(`${tempResult[0]}*`) === -1) result.push(`${tempResult[0]}*`);
      result.push(originDate[item].indexName);
    }
  }
  return result;
};

const extractDate = (el) => {
  const parts = el.split('-');
  if (parts.length > 1) {
    let date = parts[parts.length - 1];
    let dateParts = date.split('.');
    if (dateParts.length === 2) {
      dateParts.push(1)
    }
    if (dateParts.length === 3) {
      let d = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], 0, 0, 0);
      let formatter = new Intl.DateTimeFormat(['ru', 'en'], {
        month: 'long',
        year: 'numeric'
      });

      let month = formatter.format(d);
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
    let name = names[i].replace(/(\d{4}).(\d{2}).(\d{2})/g, '*');
    if (undefined === map[name]) {
      map[name] = true;
      result.push(name);
    }
  }
  return result;
};


uiModules
  .get('app/indies_view', ['ui.bootstrap'])
  .controller('indiesViewHome', ($http, $scope) => {
    $scope.title = 'Elopen';
    $scope.description = 'Elasticsearch index opener';
    $http
      .get('../api/elopen/_stats')
      .then((response) => {
        $scope.date = buildDate(response.data.metadata.indices);
        // console.log($scope.date);
        $scope.dates = {};

        $scope.test = buildIndexes($scope.date);
        $scope.indices = extractNames(buildIndexes($scope.date));
        // console.log($scope.date);
        // console.log($scope.indices);

        // for (let i = 0; i < indexes.length; i++) {
        //   let date = extractDate(indexes[i].index);
        //   indexes[i].date = date.date;
        // }

        // indexes = orderBy(indexes, "date", true);
        // $scope.indexName = indexName;

        for (let i = 0; i < $scope.test.length; i++) {
          let index = $scope.test[i];
          let status = $scope.date[i].status;
          let date = extractDate($scope.date[i].indexName);
          if (date !== undefined) {
            if ($scope.dates[date.month] === undefined) {
              $scope.dates[date.month] = [];
            }
            $scope.dates[date.month].push({
              date: date,
              index: {
                index: index,
                status: status
              }
            });
          }
        }

        console.log($scope.dates);

        // работает
        // $scope.test = extractDate($scope.date[0].indexName);
        // console.log($scope.test);

        // console.log($scope.date);
        // $scope.indices = buildIndexes($scope.date);
        // console.log($scope.indices);
      });

    // открть индекс
    $scope.openCurrentIndex = (indexName) => {
      $http
        .get('../api/elopen/index/' + indexName + '/_open')
        .then((response) => {
          if (response.status === 200) console.log('ok');
          console.log('err');
        });
    };
  });
