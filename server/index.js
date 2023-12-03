const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3001;
app.use(cors()); // app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
});

// Local code blocks data base
const codeBlocks = [
    { id: '1', title: 'Async task', code: 'console.log("task 1");' },
    { id: '2', title: 'Sync task', code: 'console.log("task 2");' },
    { id: '3', title: 'React task', code: 'console.log("task 3");' },
    { id: '4', title: 'Node task', code: 'console.log("task 4");' },
  ];

// Standard requests for testing server
app.get('/', (req, res) => {
    res.json({ message: 'test' });
});

app.get('/api', (req, res) => {
    res.json({ message: "Respond from server!" });
});

app.get('/code-block/:id', (req, res) => {
    const block = codeBlocks.find(b => parseInt(req.params.id) == b.id);
    if (!block) {
        res.status(404).send("code block not found");
    } else {
        res.json(block);
    }
});

app.post('/code-block', (req, res) => {
    if (!req.body.code) {
        res.status(400).send("illegal code block found");
        return;
    }

    const newOne = {
        id: codeBlocks.length + 1,
        title: `Code Block ${codeBlocks.length + 1}`,
        code: req.body.code
    }

    codeBlocks.push(newOne);
    res.send(newOne);
});

app.put('/code-block/:id', (req, res) => {
    const block = codeBlocks.find(b => b.id == parseInt(req.params.id));
    if (!block) {
        res.status(400).send("code block to change was not found");
    } else {
        block.code = req.body.code;
        res.send(block);
    }
});

// Realtime socket for code block pages
let room1 = 0, room2 = 0, room3 = 0, room4 = 0;

io.on("connection", (socket) => {
    console.log(`User id ${socket.id}`);

    socket.on("connect_1", (data) => {
        room1++;
        socket.emit("user_counter", room1);
        socket.emit(`init_${data}`, codeBlocks[data - 1]);
    });
    socket.on("connect_2", (data) => {
        room2++;
        socket.emit("user_counter", room2);
        socket.emit(`init_${data}`, codeBlocks[data - 1]);
    });
    socket.on("connect_3", (data) => {
        room3++;
        socket.emit("user_counter", room3);
        socket.emit(`init_${data}`, codeBlocks[data - 1]);
    });
    socket.on("connect_4", (data) => {
        room4++;
        socket.emit("user_counter", room4);
        socket.emit(`init_${data}`, codeBlocks[data - 1]);
    });

    socket.on("send_code_1", (data) => {
        socket.broadcast.emit("receive_code_1", data); 
        codeBlocks[0].code = data.code;
        // console.log(codeBlocks[0]);
    });
    socket.on("send_code_2", (data) => {
        socket.broadcast.emit("receive_code_2", data); 
        codeBlocks[1].code = data.code;
        // console.log(codeBlocks[1]);
    });
    socket.on("send_code_3", (data) => {
        socket.broadcast.emit("receive_code_3", data); 
        codeBlocks[2].code = data.code;
        // console.log(codeBlocks[2]);
    });
    socket.on("send_code_4", (data) => {
        socket.broadcast.emit("receive_code_4", data); 
        codeBlocks[3].code = data.code;
        // console.log(codeBlocks[3]);
    });
});

server.listen(PORT, () => {    
    console.log(`Server listening on ${PORT}`);
});


