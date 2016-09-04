import uiRoutes from 'ui/routes';

import './less/main.less';
import dashboardTemplate from './templates/dashboard.html';
import indexTemplate from './templates/index.html';

uiRoutes.enable();
uiRoutes.when('/', {
    template: dashboardTemplate,
    controller: 'Dashboard',
    resolve: {
        indices($http) {
            return $http.get('../elasticsearch/_cat/indices?format=json').then(function (resp) {
                return resp;
            });
         }
     }
});
uiRoutes.when('/index/{name}', {
    template: indexTemplate,
    controller: 'Index',
    resolve: {
        indices($http) {
            return $http.get('../elasticsearch/_cat/indices?format=json').then(function (resp) {
                return resp;
            });
         }
     }
});

require('plugins/elopen/lib/controllers/Dashboard.js');
require('plugins/elopen/lib/controllers/Index.js');
