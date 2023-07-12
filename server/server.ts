import express, { Request, Response } from 'express';
import WebSocket from 'ws';
import cors from 'cors';

const app = express();
const PORT = 3000;
app.use(cors());

let counter = 0;
const timestampHistory: number[] = [];

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (socket: WebSocket) => {
    socket.send(JSON.stringify({ type: 'counterUpdate', counter }));

    socket.on('close', () => {
        console.log('Client disconnected');
    });
});

app.use(express.json());

app.get('/counter', (req: Request, res: Response) => {
    res.json({ counter, timestampHistory });
});

app.post('/counter/increase', (req: Request, res: Response) => {
    counter++;
    const timestamp = Date.now();
    timestampHistory.push(timestamp);

    if (timestampHistory.length > 5) {
        timestampHistory.shift();
    }

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'counterUpdate', counter }));
        }
    });

    res.json({ counter });
});
