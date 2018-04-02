const rf=require('nrf24');

var radio0=new rf.nRF24(24,0);
var radio1=new rf.nRF24(25,1);
console.log("RADIO 0\n");
radio0.begin(true);
console.log("\n RADIO 1\n");
radio1.begin(true);

var config={PALevel:rf.RF24_PA_MAX,
             DataRate:rf.RF24_1MBPS,
             Channel:77};

console.log("CONFIG R0:"+ radio0.config(config));
console.log("CONFIG R1:"+ radio1.config(config));

// Open Pipes
var Pipes=["0x65646f4e31","0x65646f4e32"];
//var rPipes=["0x72646f4e31","0x72646f4e32"];

// Two-way binding
radio0.useWritePipe(Pipes[1]);
radio1.useWritePipe(Pipes[0]);
radio0.addReadPipe(Pipes[0],true);
radio1.addReadPipe(Pipes[1],true);


var it0=0,rx=[0,0];
var it1=0

function readFactory(n) {
    return function(data,pipe) {
      var d=data.toString();
      //console.log("R" + n + " readed ->" + d);
      rx[n]++;
    }
}

radio0.read(readFactory(0),function(){});
radio1.read(readFactory(1),function(){});



setInterval(function(){
  var b=Buffer.from("" + it0);
  console.log("R0 Send " + it0 + "[" + radio0.write(b) + "]");
  it0++;
},1000);

setInterval(function(){
  var b=Buffer.from("" +it1);
  console.log("R1 Send " + it1 + "[" + radio1.write(b) + "]");
  it1++;
},2000);

setInterval(function(){
  console.log("R0->R1 " + (rx[1]/it0)*100 + "% / R1->R0 " + (rx[0]/ it1)*100 +"%");
},20000);

console.log("Test Started... CTRL+C to close");
