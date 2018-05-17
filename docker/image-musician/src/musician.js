
const protocol = require('./protocole.js')
const dgram = require('dgram');
const uuidv4 = require('uuid/v4');
const socket = dgram.createSocket('udp4');


function Instrument(instrument) {
    this.instrument = instrument;
    this.uuid = uuidv4();
    var instrumentSound = new Map();
    instrumentSound.set("flute","trulu");
    instrumentSound.set("trupmet","pouet");
    instrumentSound.set("piano","ti-ta-ti");
    instrumentSound.set("violin","gzi-gzi");
    instrumentSound.set("drum","boum-boum");

    this.sound = instrumentSound.get(instrument);
    this.activeSince = new Date(Date.now());

    var data = {
        uuid: this.uuid,
        soud: this.soud,
        instrument:this.instrument,
        activeSince: this.activeSince,
    }

    var payload = JSON.stringify(data);
    message = new Buffer(payload);
    Instrument.prototype.playMusic = function () {
        socket.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function (err, bytes) {
        })


    }
    setInterval(this.playMusic.bind(this), 1000);
}

var inst = process.argv[2];
const instrument = new Instrument(inst);



