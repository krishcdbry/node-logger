let express = require('express');
let app = express();
let _http= require('http');
let http = _http.Server(app);
let io = require('socket.io')(http);
let fs = require('fs');
let data = "Hey this is random log !!"
let clientConencted = false;
let connectedClient = null;
let fileStream = "logger.txt";
let _bsize = 256,
    _readBytes = 0,
    _file,
    _line = 0;


function writeFile() {
    fs.appendFile(fileStream, data + "\n", (err) => {  
        // throws an error, you could also catch it here
        if (err) throw err;
    
        // success case, the file was saved
        console.log("Saving..!");

        setTimeout(() => {
            writeFile()
        }, 3000);
    });
}
    
function readingLogger() {
    fs.open(fileStream, 'r', (err, fd) => { 
        console.log("Logged opened");
        fs.watch(fileStream, (event, filename) => {
            if (event == 'change') {
                _file = fd; 
                let stats = fs.fstatSync(_file, 'utf8'); 
                if(stats.size > _readBytes+1) {
                    fs.read(_file, 
                        new Buffer(_bsize)
                        , 0
                        , _bsize
                        , _readBytes
                        , processReadData);
                }
            }
        }); 
    });
}

function processReadData(err, bytecount, buff) {
    let readlog = buff.toString('utf-8', 0, bytecount);

    // logging to client connected
    connectedClient.emit("logging", readlog);

    // Hmm continue now 
    _readBytes += bytecount;
}

io.on( 'connection', function( client ) {
    clientConencted = true;
    connectedClient = client;
    readingLogger();

	client.on('disconnect', function() {
        console.log("Disconnected");
        clientConencted = false;
	});
});


http.listen('9000', function () {
    console.log("Working dude !!");
    writeFile();
});
