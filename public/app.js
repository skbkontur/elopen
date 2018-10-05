import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';
import { getShortLIst } from './controllers/index';
import 'angular-ui-bootstrap';
import { buildDate, extractDate, extractNames } from './controllers';
import * as data from '../dictionary.json';

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
    // дабы показывать в elopen только их индексы
    const commandName = window.location.hostname.match(/\w*(?=-elk*)/)[0];
    $scope.init = () => {
      const getIndices = dictionary => {
        // формирует строку для поиска в elk
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

      // есть в словаре
      if (data[commandName]) {
        getIndices(data[commandName])
        .then(res => {
          $scope.names = getShortLIst(res);
          // for(const key in res) {
          //   console.log(res[key]);
          // }
        });
        // нет в словаре
      } else {
        getIndices([])
          .then(res => {
            const test = getShortLIst(res);

          });
      }

    };
    $scope.init();


    // Для пустых темлейтов, нужен для шаблона html
    // $scope.checkObj = name => {
    //   return Object.keys(name).length === 0;
    // };

    // $scope.openCurrentIndex = indexName => {
    //   indexName.status = 'verifying';
    //   $http
    //     .get(`../api/elopen/index/${indexName.name}/_open`)
    //     .then((response) => {
    //       if (response.status === 200) {
    //         indexName.status = 'open';
    //       }
    //       else {
    //         indexName.status = 'error';
    //         // console.log('Error with elasticsearch on open index');
    //       }
    //     });
    //   setTimeout($scope.init, 1000);
    // };

    // search index by name (regexp)
    // $scope.searchName = name => {
    //   if (name[name.length - 1] === '*') {
    //     const indexSearchName = name.substr(0, name.length - 1);
    //     const regexp = new RegExp(`^${indexSearchName}\\d{4}.\\d{2}.\\d{2}$`);
    //     $scope.dates = {};
    //     for (let i = 0; i < $scope.indices.length; i++) {
    //       if($scope.indices[i].indexName.match(regexp)) {
    //         const index = $scope.indices[i].indexName;
    //         const status = $scope.indices[i].status;
    //         const date = extractDate($scope.indices[i].indexName);
    //         if (date !== undefined) {
    //           if ($scope.dates[date.month] === undefined) {
    //             $scope.dates[date.month] = [];
    //           }
    //           $scope.dates[date.month].push({
    //             date: date.date,
    //             index: {
    //               name: index,
    //               status: status
    //             }
    //           });
    //         }
    //       }
    //     }
    //   }
    //   else {
    //     $scope.dates = {};
    //   }
    // };

  });


      // $scope.init = () => {
      //   $http
      //     .get('../api/elopen/_stats')
      //     .then((response) => {
      //       // обработка правил отображения, как еденичного, так и массива
      //       const commands = [];
      //       const completeCommand = [];
      //       if (commandName in article) {
      //         // массив
      //         if (typeof (article[`${commandName}`]) === 'object') {
      //           for (let i = 0, length = article[`${commandName}`].length; i < length; i++) {
      //             commands.push(article[`${commandName}`][i]);
      //           }
      //         }
      //         // одна команда
      //         else {
      //           commands.push(article[`${commandName}`]);
      //         }
      //         commands.push(commandName);
      //       } else {
      //         commands.push(commandName);
      //       }
      //       // формируем итоговый спикок, отправляя в функцию по очереди все элементы массива
      //       for (let i = 0, length = commands.length; i < length; i++) {
      //         const a = buildDate(response.data, commands[i]);
      //         for (let b = 0, len = a.length; b < len; b++) {
      //           completeCommand.push(a[b]);
      //         }
      //       }

      //       $scope.indices = completeCommand;
      //       // console.log($scope.indices);

      //       for (let i = 0; i < $scope.indices.length; i++) {
      //         const valideDate = new RegExp(`^.*-\\d{4}.\\d{2}.\\d{2}$`);
      //         // Игнорим автосозданные триггер индексы и все, у которых дата кривая
      //         if ($scope.indices[i].indexName[0] !== '.' && $scope.indices[i].indexName.match(valideDate)) {
      //           const date = extractDate($scope.indices[i].indexName);
      //           if (date) $scope.indices[i].date = date.date;
      //         }
      //       }
      //       $scope.indices = $filter('orderBy')($scope.indices, 'date', true);
      //       $scope.names = extractNames($scope.indices);
      //       $scope.names = $filter('orderBy')($scope.names);
      //       $scope.searchName($scope.names[0]);
      //     });
      // };
      // $scope.init();