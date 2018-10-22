const elasticsearch = require('elasticsearch');

export default server => {
  const config = server.config();
  const client = new elasticsearch.Client({
    host: config.get('elasticsearch.url'),
  });
  server.route({
    path: '/api/elopen/{name}/_stats',
    method: 'GET',
    handler(req, reply) {
      const name = req.params.name;
      client.cat.indices({
        format: 'json',
        h: 'index,status',
        index: `${name}`
        // index: 'stacktracejs-report-egais*,alko*,stacktracejs-report-alko*'
      }, (err, response) => {
        if (err) console.log(err);
        reply(response);
      });
    }
  });
  server.route({
    path: '/api/elopen/config',
    method: 'GET',
    handler(req, reply) {
      client.get({
        index: 'elopen',
        type: '_doc',
        id: 1,
      }, (err, response) => {
        if (err) console.log(err);
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
        if (err) console.log(err);
        reply(response.status);
      });
    }
  });
  server.route({
    path: '/api/elopen/index/{name}/_close',
    method: 'GET',
    handler(req, reply) {
      const name = req.params.name;
      client.indices.close({
        index: name,
        human: true,
      }, (err, response) => {
        if (err) console.log(err);
        reply(response.status);
      });
    }
  });
};
