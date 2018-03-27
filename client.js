var socket = io.connect('http://localhost:9000');
var logger = document.getElementById('logger');

socket.on('logging', function (data) {
    console.log(data);
    logger.innerHTML += "<br/>" + data;
});