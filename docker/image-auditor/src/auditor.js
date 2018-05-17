var protocol = require("./protocole.js");
var dgram = require('dgram');
var net = require('net');
var s = dgram.createSocket('udp4');
var moment = require("moment")


var mapMusicians = new Map()

s.bind(protocol.PROTOCOL_PORT, function () {
    s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});


s.on('message', function (msg, source) {
    console.log("Recu un datagramme");
    var musicien = JSON.parse(msg);
    if (mapMusicians.has(musicien.uuid)) {
        mapMusicians.get(musicien.uuid).lastUpdate = new Date(Date.now());

    } else {
        musicien.lastUpdate = new Date(Date.now())
        mapMusicians.set(musicien.uuid, musicien)
    }
});

var server = net.createServer(function(socket) {
    var arrayOfMusician = [];

    var now = moment(new Date(Date.now()));
    for (let musi of mapMusicians.values()) {

        if ((moment(now).diff(moment(musi.lastUpdate), "seconds") > 5) ){
            mapMusicians.delete(musi)
        } else {
            infoTosend = new Object();
            infoTosend.uuid = musi.uuid;
            infoTosend.instrument = musi.instrument;
            infoTosend.activeSince = musi.activeSince;
            arrayOfMusician.push(infoTosend);
        }
    }

    var payload = JSON.stringify(arrayOfMusician) ;
    message = new Buffer(payload);

    socket.write(payload + "\r\n");
    socket.end();

}).listen(protocol.PROTOCOL_PORT);
