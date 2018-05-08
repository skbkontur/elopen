const elasticsearch = require('elasticsearch');

export default function (server) {
  const config = server.config();
  const client = new elasticsearch.Client({
    host: config.get('elasticsearch.url'),
  });
  server.route({
    path: '/api/elopen/_stats',
    method: 'GET',
    // переехал на другой метод api
    handler(req, reply) {
      client.cluster.state({
        metric: 'metadata',
        human: true,
      }, function (err, response) {
        reply(response);
      });
    }
  });
  // не понял зачем нужен маршрут
  server.route({
    path: '/api/elopen/index/{name}',
    method: 'GET',
    handler(req, reply) {
      const name = req.params.name;
      client.cluster.state({
        metric: 'metadata',
        index: name,
        human: true,
      }, (err, response) => {
        reply(
          response.metadata.indices[name]
        );
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
