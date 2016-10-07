import uiRoutes from 'ui/routes';

import './less/main.less';
import template from './templates/dashboard.html';


uiRoutes.enable();
uiRoutes.when('/', {
    template: template,
    controller: 'Dashboard',
});

uiRoutes.when('/index/:index', {
    template: template,
    controller: 'Dashboard',
});

require('plugins/elopen/lib/controllers/Dashboard.js');