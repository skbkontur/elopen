import exampleRoute from './server/routes/example';


module.exports = function(kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],

    uiExports: {
      
      app: {
        title: 'Elopen',
        description: 'Smooth Elasticsearch index opener',
        main: 'plugins/elopen/app',
        icon: 'plugins/elopen/icon.svg'
      },
      
    },

    init(server, options) {
      // Add server routes and initalize the plugin here
      exampleRoute(server);
    }
    

  });
};
