import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './less/main.less';
import template from './templates/index.html';

uiRoutes.enable();
uiRoutes.when('/', {
    template,
    resolve: {
        currentTime($http) {
            return $http.get('../api/elopen/example').then(function (resp) {
                return resp.data.time;
            });
        }
    }
});


require('plugins/elopen/lib/controllers/IndexCtrl.js');
