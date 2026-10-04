import * as net from 'net';



// ---- Dynamic buffer per connection ----
class LineBuffer {
  constructor() {
    this.buffer = Buffer.alloc(0);
  }

  // Push new bytes, return array of complete lines (without the \n)
  push(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk]);

    const lines = [];
    let index;

    // Keep extracting while a newline exists
    while ((index = this.buffer.indexOf(0x0a)) !== -1) {
      const line = this.buffer.subarray(0, index); // bytes before \n
      lines.push(line.toString('utf8').replace(/\r$/, '')); // strip \r
      this.buffer = this.buffer.subarray(index + 1); // keep remainder
    }

    return lines;
  }

  // Optional: cap buffer size to protect against malicious clients
  get size() {
    return this.buffer.length;
  }
}

const MAX_BUFFER = 1024 * 1024; // 1 MB per connection

// ---- Fake async work ----
async function processMessage(msg) {
  await new Promise(r => setTimeout(r, 100)); // simulate DB / API
  return msg.toUpperCase();
}

// ---- Server ----
const server = net.createServer(async (socket) => {
  const client = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`[+] ${client} connected`);

  const lineBuffer = new LineBuffer();

  try {
    for await (const chunk of socket) {
      // Guard against unbounded memory growth
      if (lineBuffer.size + chunk.length > MAX_BUFFER) {
        socket.write('ERR: message too large\n');
        socket.destroy();
        return;
      }

      const messages = lineBuffer.push(chunk);
      for (const message of messages) {
        if (!message) continue; // skip empty lines

        console.log(`[${client}] ${message}`);
        const result = await processMessage(message);
        socket.write(`echo: ${result}\n`);
      }
    }
  } catch (err) {
    if (err.code !== 'ECONNRESET') {
      console.error(`[${client}] error:`, err.message);
    }
  } finally {
    console.log(`[-] ${client} disconnected`);
  }
});

server.listen(3000, () => console.log('Line-buffered echo server on :3000'));