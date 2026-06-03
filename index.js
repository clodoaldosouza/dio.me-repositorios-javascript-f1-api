const fastify = require('fastify')({ logger: true });
const swagger = require('fastify-swagger');

// Configuração Swagger /docs
fastify.register(swagger, {
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'API Fórmula 1',
      description: 'Minimal API da Fórmula 1 com Fastify',
      version: '1.0.0'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  },
  exposeRoute: true
});

// Dados simulados
let pilotos = [
  { id: 1, nome: 'Lewis Hamilton', equipe: 'Mercedes' },
  { id: 2, nome: 'Max Verstappen', equipe: 'Red Bull' },
  { id: 3, nome: 'Charles Leclerc', equipe: 'Ferrari' }
];

let equipes = [
  { id: 1, nome: 'Mercedes' },
  { id: 2, nome: 'Red Bull' },
  { id: 3, nome: 'Ferrari' }
];

let corridas = [
  { id: 1, nome: 'GP de Mônaco', vencedor: 'Charles Leclerc' },
  { id: 2, nome: 'GP da Inglaterra', vencedor: 'Lewis Hamilton' }
];

// Rotas Pilotos
fastify.get('/pilotos', async () => pilotos);
fastify.get('/pilotos/:id', async (req, reply) => {
  const piloto = pilotos.find(p => p.id === Number(req.params.id));
  return piloto || reply.code(404).send({ erro: 'Piloto não encontrado' });
});
fastify.post('/pilotos', async (req) => {
  const novo = { id: pilotos.length + 1, ...req.body };
  pilotos.push(novo);
  return novo;
});
fastify.put('/pilotos/:id', async (req, reply) => {
  const idx = pilotos.findIndex(p => p.id === Number(req.params.id));
  if (idx === -1) return reply.code(404).send({ erro: 'Piloto não encontrado' });
  pilotos[idx] = { id: Number(req.params.id), ...req.body };
  return pilotos[idx];
});
fastify.delete('/pilotos/:id', async (req, reply) => {
  const idx = pilotos.findIndex(p => p.id === Number(req.params.id));
  if (idx === -1) return reply.code(404).send({ erro: 'Piloto não encontrado' });
  const removido = pilotos.splice(idx, 1);
  return removido[0];
});

// Rotas Equipes
fastify.get('/equipes', async () => equipes);
fastify.post('/equipes', async (req) => {
  const nova = { id: equipes.length + 1, ...req.body };
  equipes.push(nova);
  return nova;
});

// Rotas Corridas
fastify.get('/corridas', async () => corridas);
fastify.post('/corridas', async (req) => {
  const nova = { id: corridas.length + 1, ...req.body };
  corridas.push(nova);
  return nova;
});

// Inicialização
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('API da F1 rodando em http://localhost:3000');    
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
