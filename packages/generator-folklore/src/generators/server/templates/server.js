import { program } from 'commander';
import createDebug from 'debug';
import { renderFile } from 'ejs';
import express from 'express';
import { createServer } from 'http';
import path from 'path';<% if (socketIo) { %>
import { Server } from 'socket.io';<% } %>

const debug = createDebug('server');

program
    .description('Run server')
    .option('-p, --path <path>', 'Path to static', './dist')
    .option('--port <port>', 'Server port', process.env.PORT || 5000);
program.parse();

const { port, path: staticPath } = program.opts();

const webPath = path.join(process.cwd(), staticPath);

// Express server
const app = express();
const httpServer = createServer(app);
app.set('view engine', 'html');
app.set('views', webPath);
app.engine('html', renderFile);
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    }),
);
app.use(express.static(webPath));

app.get('/', async (req, res) =>
    res.render('index.html.ejs', {
        counter,
        fromServer: true,
    }),
);

app.get('*', async (req, res) => {
    return res.render('index.html.ejs', {
        counter,
        fromServer: true,
    });
});<% if (socketIo) { %>

// Socket io
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
io.on('connection', (socket) => {});<% } %>

// Start server
httpServer.listen(port, () => {
    debug('Listening on port %i', port);
});
