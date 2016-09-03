export default function (server) {

    server.route({
            path: '/api/elopen/index',
            method: 'GET',
            handler(req, reply) {
                reply("Hello World");
            }
        });

    server.route({
            path: '/api/elopen/index/{name}',
            method: 'GET',
            handler(req, reply) {
                server.plugins.elasticsearch.callWithRequest(req, 'cluster.state', {
                    metric: 'metadata',
                    index: req.params.name
                }).then(function (response) {
                    reply(response.metadata.indices[req.params.name]);
                });
            }
        });

};
