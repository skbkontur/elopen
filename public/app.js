import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './less/main.less';
import template from './templates/index.html';

uiRoutes.enable();
uiRoutes.when('/', {
    template,
    controller: 'IndexCtrl',

});


require('plugins/elopen/lib/controllers/IndexCtrl.js');
