# web-server

TCP protocol is a bidirectional channel for transmitting raw bytes.

 client        server
 ------        ------

| req1 |  ==>
         <==  | res1 |
| req2 |  ==>
         <==  | res2 |
         ...

An HTTP request consists of a header followed by an optional payload.

The Header contains the URL of the request, or the response code

# HTTP Example

using nc or curl

GET / HTTP/1.0
Host: example.com
(empty line)


**Response**

HTTP/1.0 200 OK
Age: 525410
Cache-Control: max-age=604800
Content-Type: text/html; charset=UTF-8
Date: Thu, 20 Oct 2020 11:11:11 GMT
Etag: "1234567890+gzip+ident"
Last-Modified: Thu, 20 Oct 2019 11:11:11 GMT
Vary: Accept-Encoding
Content-Length: 1256
Connection: close

<!doctype html>
<!-- omitted -->

# Half-Open connections

Each tcp connection direction is ended independently.
Where on direction is closed and the other is still open.

- First peer cannot send any more data, but cal still receive from second peer.
- Second peer gets EOF, but can still send the first peer.

```
let server = net.createServer({allowHalfOpen: true});
```

# Dynamic buffer

In a real TCP server, for await (const chunk of socket) gives you arbitrary chunks — not full messages.
A client might send "hello\n" split across two packets, or three messages in one packet. 
A dynamic buffer accumulates incoming bytes and extracts complete messages (typically delimited by \n).

Network reality one logical message can arrive as:

Packet 1: "hel"
Packet 2: "lo\n"