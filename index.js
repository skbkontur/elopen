import indexesRoute from './server/routes/indices';

export default function (kibana) {
    return new kibana.Plugin({
        require: ['elasticsearch'],
        name: 'elopen-plugin',
        uiExports: {

            app: {
                title: 'Elopen',
                description: 'An awesome Kibana plugin',
                main: 'plugins/elopen/app',
                icon: 'plugins/elopen/icon.svg'
            },
        },

        init(server) {
            indexesRoute(server);
        }

    });
};
