//creamos el socket, es necesaria la url, que es donde se
//encuentra el servidor. El parámetro (forceNew) es opcional.
var socket = io.connect("http://192.168.1.105:6677",{"forceNew":true});
//
//el cliente recibe los datos de messages con el método on,
//que permite recibir eventos del servidor
socket.on("messages",function(data){
  console.log(data);

  render(data);
  //console.log(this.texto);
});

//la función render maneja los datos de vienen en messages y
//actualiza el div. En este caso recorremos mediante el
//método map para añadir valores del array en un div
function render(data){
  var html = data.map(function(message,index){
    return (`
      <div class="message">
        <p>${message.text}</p>
      </div>
    `);
  }).join(" "); //join para meter un espacio

  //añadimos al div #messages el contenido de html
  let div = document.getElementById("mensaje");
  //console.log(div.innerHTML);return;
  div.innerHTML= html;
  //div.scrollTop=div.scrollHeight;
}

function addMessage(e){
  var datos = {
    nickname: "manu", //document.getElementById("nickname").value,
    text: document.getElementById("texto").value
  };
  //document.getElementById("nickname").style.display="none";
  socket.emit("add-message",datos);

  return false;
}
