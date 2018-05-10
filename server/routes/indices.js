const elasticsearch = require('elasticsearch');

export default function (server) {
  const config = server.config();
  const client = new elasticsearch.Client({
    host: config.get('elasticsearch.url'),
  });
  server.route({
    path: '/api/elopen/_stats',
    method: 'GET',
    handler(req, reply) {
      client.cluster.state({
        metric: 'metadata',
        human: true,
      }, function (err, response) {
        reply(response);
      });
    }
  });
  server.route({
    path: '/api/elopen/index/{name}/_open',
    method: 'GET',
    handler(req, reply) {
      const name = req.params.name;
      client.indices.open({
        index: name,
        human: true,
      }, (err, response) => {
        reply(response.status);
      });
    }
  });
}
