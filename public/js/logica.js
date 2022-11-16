var socket = io.connect('http://localhost:8080/');
var list = document.querySelector('#lista-users');
var username = window.location.pathname.replace('/chat/', '');
var clientes = [];

function conectarChat() {
  var id = socket.id;
  console.log('id:', socket.id, 'useranme:', username);
  $.post('/login', {username: username, id: id}, function (data) {
    console.log(data);
    clientes = data;
    list.innerHTML += '...';
    var html = '';
    clientes.forEach(function (cliente) {
      html += '<li>' + cliente.username + '</li>';
   });
    list.innerHTML = html;
    $('.loader').hide();
  });
}

function enviarMensaje(e) {
  if (e.which != 13) return;
  var msg = document.querySelector('#input').value;
  if (msg.length <= 0) return;
  $.post('/send', {
    text: msg,
    username: username,
    id: socket.id
  }, function (data) {
    document.querySelector('#input').value = '';
  });
}

socket.on('mensaje', function (data) {
  data.username = data.username.replace('</', '');
  var sanitized = data.msg.replace('</', '');
  sanitized = sanitized.replace('>', '');
  sanitized = sanitized.replace('<', '');
  if (data.id == socket.id) {
    var msj = `
    <div class="local-message">
      <strong>${data.username}: </strong>
      <p>${sanitized}</p>
    </div>
    `;
    document.querySelector('.mensajes-container').innerHTML += msj;
  } else {
    var msj = `
    <div class="remote-message">
      <strong>${data.username}: </strong>
      <p>${sanitized}</p>
    </div>
    `;
    document.querySelector('.mensajes-container').innerHTML += msj;
  }
})

socket.on('socket_desconectado', function (data) {
  console.log(data);
  clientes = clientes.filter(function (cliente) {
    console.log(cliente);
    return cliente.id != data.id;
  });
  list.innerHTML += 'loading';
  var html = '';
  clientes.forEach(function (cliente) {
    html += '<li>' + cliente.username + '</li>';
  });
  list.innerHTML = html;
});

socket.on('socket_conectado', function (data) {
  console.log(data);
  clientes.push(data);
  list.innerHTML += 'loading';
  var html = '';
  clientes.forEach(function (cliente) {
    html += '<li>' + cliente.username + '</li>';
  });
  list.innerHTML = html;
});
