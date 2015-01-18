// MMO.js by Kariboo84
//
//	##     ##  ##     ##    ####         ###    ####
//  ## ### ##  ## ### ##  ##    ##        ##   ##   #
//  ##  #  ##  ##  #  ##  ##    ##        ##    ###
//  ##     ##  ##     ##  ##    ##    #   ## #    ##
//  ##     ##  ##     ##    ####    #  ####   #####
//	MASSIVE MESSAGING OPERATOR

// files are served by php serveur so lets Socket.io !
var io=require('socket.io').listen(8080,{ log: false });
var messages=[];
// make connexion for clients :
io.sockets.on('connection',function(socket){
	var me={};
	var socketId = socket.id
    var clientIp = socket.request.connection.remoteAddress
	console.log("New connection from " +clientIp);
	socket.on('login',function(data){
		console.log(data);
		//creation of me ^^
		me={'pseudo':data.pseudo,'id':socket.id};
		socket.broadcast.emit('newser',data);
		
	});
	
	socket.on('wpio_init',function(){
		console.log("plugin connected from "+clientIp);
	});
	socket.on('move',function(pos){
		//console.log("move : "+pos.x+','+pos.y);
	
		socket.broadcast.emit('move',pos,socket.id);
	
	});
	socket.on('message',function(mess){
	messages.push(mess);
	socket.broadcast.emit('message',mess);
	if(mess.indexOf('/parier')==0){
	pari=mess.split(' ')[1];
	socket.broadcast.emit('message',socket.id+' paris sur le nombre '+pari);
	}
	});
	for(var i=0;i<messages.length;i++){
	socket.emit('message',messages[i]);
	}
	socket.on('tirage',function(w){
		if(w==pari){
		io.of('/').emit('gagne',socket.id,pari);
		}else{socket.emit('perdu',pari);}
	});
	var pari=0;
});
var tps=120000;var t=0;
var inter=setInterval(
function(){
		var win=rand(100,0);console.log(win);
		
		io.of('/').emit('message',win);
		io.of('/').emit('tirage',win);
		tps=120000;
		
	}
,120000);
var interetimer=setInterval(
function(){
		tps-=1000;
		io.of('/').emit('retimer',tps);
		
		
	}
,1000);

function rand(a,b){
	r=Math.floor((Math.random()*a)+b);
	return r
};