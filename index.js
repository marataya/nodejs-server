var lorawan = require('lorawan-js');

var prop = {"port":3000};
var lwServer = new lorawan.Server(prop);

lwServer.start();

lwServer.on("ready", (info, server) => {
  console.log("Ready: ", info);
});


lwServer.on('pushdata_rxpk', (message, clientInfo) => {

  var pdata = message.data.rxpk[0].data;
  var buff = new Buffer(pdata, 'Base64');

  var MYpacket = lorawan.Packet(buff);

  console.log("[Upstream] IN pushdata RXPK - ", MYpacket.MType.Description ," from: ", MYpacket.Buffers.MACPayload.FHDR.DevAddr);

  if (MYpacket.Buffers.MACPayload.FHDR.DevAddr.toString('hex')=="be7a0000") {

     var NwkSKey = new Buffer('000102030405060708090A0B0C0D0E0F', 'hex');
     var AppSKey = new Buffer('000102030405060708090A0B0C0D0E0F', 'hex');

     var MYdec = MYpacket.decryptWithKeys(AppSKey, NwkSKey);

     console.log("MY Time: " + MYdec.readUInt32LE(0).toString() + " Battery: " + MYdec.readUInt8(4).toString() + " Temperature: " + MYdec.readUInt8(5).toString() + " Lat: " + MYdec.readUInt32LE(6).toString() + " - Long: " + MYdec.readUInt32LE(10).toString());

  } else if(MYpacket.Buffers.MACPayload.FHDR.DevAddr.toString('hex')=="03ff0001") {

    var NwkSKey = new Buffer('2B7E151628AED2A6ABF7158809CF4F3C', 'hex');
    var AppSKey = new Buffer('2B7E151628AED2A6ABF7158809CF4F3C', 'hex');


    var MYdec = MYpacket.decryptWithKeys(AppSKey, NwkSKey);
    console.log("MYdec: ", MYdec.toString('utf8'), " - ", MYdec.length);

  }  else {

    console.log("New device: ", MYpacket.Buffers.MACPayload.FHDR.DevAddr.toString('hex'));

  }

});