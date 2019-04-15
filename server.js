const net = require('net');
const server = net.createServer();

server.on('connection', clientToProxySocket => {
    console.log('============ Client Connected To Proxy ============');

    // We need only the data once, the starting packet
    clientToProxySocket.once('data', data => {
        let isTLSConnection = data.toString().indexOf('CONNECT') !== -1;
        console.log(data.toString());

        //Considering Port as 80 by default
        let serverPort = 80;
        let serverAddress;
        if (isTLSConnection) {
            // Port changed to 443, parsing the host from CONNECT
            serverPort = 443;
            serverAddress = data
                .toString()
                .split('CONNECT ')[1]
                .split(' ')[0]
                .split(':')[0];
        } else {
            // Parsing HOST from HTTP
            serverAddress = data
                .toString()
                .split('Host: ')[1]
                .split('\r\n')[0];
        }

        let proxyToServerSocket = net.createConnection(
            {
                host: serverAddress,
                port: serverPort
            },
            () => {
                console.log('============ PROXY TO SERVER SET UP ==============');
                if (isTLSConnection) {
                    //Send Back OK to HTTPS CONNECT Request
                    clientToProxySocket.write('HTTP/2 200 OK\r\n\n');
                } else {
                    proxyToServerSocket.write(data);
                }
                // Piping the sockets
                clientToProxySocket.pipe(proxyToServerSocket);
                proxyToServerSocket.pipe(clientToProxySocket);

                proxyToServerSocket.on('error', err => {
                    console.log('PROXY TO SERVER ERROR');
                    console.log(err);
                });
            }
        );
        clientToProxySocket.on('error', err => {
            console.log('CLIENT TO PROXY ERROR');
            console.log(err);
        });
    });
});

server.on('error', err => {
    console.log('SERVER ERROR');
    console.log(err);
});

server.on('close', () => {
    console.log('Client Disconnected');
});

server.listen(9000, () => {
    console.log('Server runnig at http://localhost:' + 9000);
});

// =========================================================

/* solution 3
const net = require('net');

const server = net.createServer({ allowHalfOpen: true }, function(clientSock) {
    let connected = false;

    let serverSock;

    clientSock.on('data', function(clientData) {
        console.log(clientData);
        let isTLSConnection = clientData.toString().indexOf('CONNECT') !== -1;

        //Considering Port as 80 by default
        let serverPort = 80;
        let serverAddress;
        if (isTLSConnection) {
            // Port changed to 443, parsing the host from CONNECT
            serverPort = 443;
            serverAddress = clientData
                .toString()
                .split('CONNECT ')[1]
                .split(' ')[0]
                .split(':')[0];
        } else {
            // Parsing HOST from HTTP
            serverAddress = clientData
                .toString()
                .split('Host: ')[1]
                .split('\r\n')[0];
        }

        if (connected) {
            // Send future messages if is connected
            serverSocet.write(clientData);
        } else {
            const host = serverAddress;
            const port = serverPort;

            // if (clientData is a CONNECT request) {

            // Create a new socket to server
            if (!serverSock) {
                // Option here
                serverSock = new net.Socket({ allowHalfOpen: true });

                serverSock.connect(port, host, function() {
                    // Don't need to forward hello message from client
                    // Connect method automatically sends it for you
                    //serverSock.write(clientData);

                    connected = true;

                    clientSock.write('HTTP/1.1 200 OK\r\n');
                });

                serverSock.on('data', function(serverData) {
                    clientSock.write(serverData);
                });
            }
            // }
        }
    });
}).listen(3000);
*/
