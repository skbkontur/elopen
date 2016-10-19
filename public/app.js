import uiRoutes from 'ui/routes';

import './less/main.less';
import template from './templates/dashboard.html';


uiRoutes.enable();
uiRoutes.when('/', {
    template: template,
    controller: 'Dashboard',
    resolve: {
        indexPatternIds: function (courier) {
            var indexes = courier.indexPatterns.getIds();
            return indexes;
        }
    }
});

uiRoutes.when('/index/:index', {
    template: template,
    controller: 'Dashboard',
    resolve: {
        indexPatternIds: function (courier) {
            return courier.indexPatterns.getIds();
        }
    }
});

require('plugins/elopen/lib/controllers/Dashboard.js');
