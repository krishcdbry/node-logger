let express = require('express');
let app = express();
let _http= require('http');
let http = _http.Server(app);
let io = require('socket.io')(http);
let fs = require('fs');
let data = "Hey this is random log !!"
let clientConencted = false;
let connectedClient = null;
let _bsize = 256,
    _readBytes = 0,
    _file,
    _line = 0;

function readingLogger() {
    let stats = fs.fstatSync(file, 'utf8'); 
    console.log(stats.size, _readBytes);
    if(stats.size < _readBytes+1) {
        console.log('Reading');
        setTimeout(readingLogger, 3000);
    }
    else {
        fs.read(file, 
            new Buffer(_bsize)
            , 0
            , _bsize
            , _readBytes
            , processReadData);
    }
}

function processReadData(err, bytecount, buff) {
    let readlog = buff.toString('utf-8', 0, bytecount);

    // logging to client connected
    connectedClient.emit("logging", readlog);

    // Hmm continue now 
    _readBytes += bytecount;
    readingLogger();
}

function initiateReader () {
    fs.open('logger.txt', 'r', (err, fd) => { 
        file = fd; readingLogger(); 
    });   
}

io.on( 'connection', function( client ) {
    clientConencted = true;
    connectedClient = client;
    initiateReader();

	client.on('disconnect', function() {
        console.log("Disconnected");
        clientConencted = false;
	});
});


http.listen('9000', function () {
    console.log("Working dude !!");
});
