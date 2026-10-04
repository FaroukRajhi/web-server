import * as net from 'net';



const server = net.createServer(async (socket) =>{
    const client = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`[+] Client connected: ${client}`);

    try{
        // Read data in a loop until client disconnects

        for await(const chunk of socket)
        {
            const message = chunk.toString().trim();
            console.log(`[${client}] received: ${message}`);


            // Similate async operation (DB lookup, API call, etc)
            await new Promise(r=> setTimeout(r,200));

            // Send it back

            socket.write(`echo: ${message}\n`);
        }
    } catch (err) {
        console.error(`[${client}] error:`, err.message);
    } finally {
        console.log(`[-] Client disconnected: ${client}`);
    }
});


server.listen(3000, () => {
    console.log("TCP Server listening on port 3000");
})