var express = require("express");
//para la subida de imágenes
var fs = require("fs");
const path= require("path");
const fileUpload = require("express-fileupload");
//Certificado SSL
var path_letsencrypt=path.resolve("/etc/letsencrypt/live/bahiaxip.com");
let options = {
	key:fs.readFileSync(path_letsencrypt+"/privkey.pem"),
	cert:fs.readFileSync(path_letsencrypt+"/cert.pem")
};

var app = express();

//server protocolo http
//var server = require("http").Server(app);
//var io = require("socket.io")(server);

//server protocolo https
var serverhttps = require("https").Server(options,app);
var io = require("socket.io")(serverhttps);


app.use(express.static("client",{redirect:false}))
app.use(fileUpload());
app.use((req,res,next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers","Authorization,X-API-KEY,Origin,X-Requested-With,Content-Type,Accept,Access-Control-Allow-Request-Method");
	res.header("Access-Control-Allow-Methods","GET,POST,OPTIONS,PUT,DELETE");
	res.header("Allow","GET,POST,OPTIONS,PUT,DELETE");
	next();
});
//subida de archivos
app.post("/uploads",(req,res) =>{
	if(req.files.imagenPropia){
		let archivo = req.files.imagenPropia;
		console.log(archivo);

		//archivo.mv("./server/uploads/"+archivo.name,err =>{
		archivo.mv("./uploads/"+archivo.name,err =>{
		
			if(err)	return res.status(500).send({message: err});			
		})
		res.status(200).send({name: archivo.name});		
	}	
});
//obtención de imagen
app.get("/get-image/:image",(req,res) => {
	var file = req.params.image;	
	var path_file = "./uploads/"+file;

	fs.exists(path_file,(exists) => {
		if(exists){
			res.status(200).sendFile(path.resolve(path_file));
		}else{
			return res.status(200).send({
				message:"No existe la imagen..."
			});
		}
	});
});

app.get("*",(req,res,next) => {
	res.sendFile(path.resolve("client/index.html"))
})
var messages= {
	id: 1,
	user:"Chat Privado",
	text: "Aplicación de Chat con NodeJS, Socket.io y Angular Material",
	nickname: "Xip",
	origen: "",
	image:""
};

io.on("connection",function(socket)  {
	socket.emit("messages",messages);
	socket.on("add-message",function(data){	
		let message=data;
		io.sockets.emit("messages",data);
	});
});

//escuchando server (http) anulado
/*server.listen(6677, function(){
	console.log("Servidor está funcionando en http://localhost:6677");
});*/

//escuchando serverhttps (https)

serverhttps.listen(6677, function(){
	console.log("Servidor está funcionando en chat-node.bahiaxip.com:6677");
});

