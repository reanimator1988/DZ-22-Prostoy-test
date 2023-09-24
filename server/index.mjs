import path from 'path';
import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import { questions } from './questions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = fastify();

server.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
});

server.get('/questions', (request, reply) => {
    reply.send(questions);
});

server.post('/answer', (request, reply) => {
    const userAnswers = request.body.answers;

    if (!Array.isArray(userAnswers)) {
        reply.status(400).send({ error: 'Invalid request' });
        return;
    }

    let correctCount = 0;
    let incorrectCount = 0;

    for (let i = 0; i < questions.length; i++) {
        if (userAnswers[i] === questions[i].correctAnswer) {
            correctCount++;
        } else {
            incorrectCount++;
        }
    }

    reply.send({ correctCount, incorrectCount });
});

server.post('/user', (request, reply) => {
    reply.send({ id: 'some-id' });
});

const start = async () => {
    try {
        await server.listen({ port: 9999 });
        console.log('Server started');
    } catch (error) {
        console.error('Error starting server', error);
        process.exit(1);
    }
};

start();
