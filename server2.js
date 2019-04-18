const net = require('net');
const server = net.createServer(socket => {
    // 'connection' listener
    const client = net.createConnection({ port: 80, host: 'theplantlist.org' }, () => {
        // 'connect' listener
        console.log('connected to server!');
        // client.write(`GET http://theplantlist.org \r\n\r\n`);
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

    client.pipe(socket);
    socket.pipe(client);
});

server.on('error', err => {
    throw err;
});

server.listen(8124, () => {
    console.log('server bound');
});
