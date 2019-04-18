const net = require('net');
const server = net.createServer(socket => {
    // 'connection' listener
    const client = net.createConnection({ port: 80, host: 'www.google.com' }, () => {
        // 'connect' listener
        console.log('connected to server!');
        client.write(`GET https://www.google.com HTTP/1.1\r\n\r\n`);
    });

    client.on('error', function() {
        console.log('error on client request');
    });

    // client.on('data', data => {
        // console.log(data.toString());
        // socket.write(data);
        // client.end();
    // });

    // client.on('end', () => {
        // socket.end();
        // console.log('disconnected from server');
    // });

    // socket.on('end', () => {
        // console.log('client disconnected');
    // });

    socket.on('error', function() {
        console.log('error on server socket');
    });

    client.pipe(socket);
    socket.pipe(client);
});

server.on('error', err => {
    console.log('error on server');
    throw err;
});

server.listen(8124, () => {
    console.log('server bound');
});
