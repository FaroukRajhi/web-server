import * as net from 'net';

// Create a TCP server and socket
const server = net.createServer();
const socket = net.Socket();

// Adding new connections
function newConn(socket = net.Socket){
    console.log('New connection added', socket.remoteAddress, socket.remotePort);
    socket.on('end',()=>  {
    // FIN received. The connection will be closed automatically
    console.log('EOF');
});

  // Read An Write


 socket.on('data', (data =  Buffer) => {
        console.log('data:', data);
        socket.write(data); // echo back the data.

        if(data.includes('q'))
        {
            console.log('closing');
            socket.end();
        }
    });
}



server.on('connection', newConn);

// Error Handling

server.on('Error', (err = Error) => { throw err});




server.listen(3000, '127.0.0.1', () => {
    console.log('Server listening on 127.0.0.1:3000');
});