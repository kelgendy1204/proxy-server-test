const net = require('net');
const server = net.createServer(socket => {
    // 'connection' listener
    console.log('client connected');
    console.log(socket.localAddress);
    socket.on('end', () => {
        console.log('client disconnected');
    });
    socket.write('hello\r\n');
    socket.pipe(socket);
});

server.on('error', err => {
    throw err;
});

server.listen(8124, () => {
    console.log('server bound');
});

// =================================================== //

const client = net.createConnection({ port: 8124 }, () => {
    // 'connect' listener
    console.log('connected to server!');
    client.write('world!\r\n');
});

client.on('data', data => {
    console.log(data.toString());
    client.end();
});

client.on('end', () => {
    console.log('disconnected from server');
});
