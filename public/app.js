import moment from 'moment';
import uiModules from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './less/main.less';
import overviewTemplate from './templates/index.html';
import detailTemplate from './templates/detail.html';

uiRoutes.enable();

uiRoutes
    .when('/', {
        template: overviewTemplate,
        controller: 'elasticsearchStatusController',
        controllerAs: 'ctrl'
    })
    .when('/index/:name', {
        template: detailTemplate,
        controller: 'elasticsearchDetailController',
        controllerAs: 'ctrl'
    });
debugger;

uiModules
    .get('app/elopen', [])
    .controller('elasticsearchStatusController', function ($http) {
        $http.get('../api/elasticsearch_status/indices').then((response) => {
            this.indices = response.data;
        });
    });