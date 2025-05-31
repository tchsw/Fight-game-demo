const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let players = {};

io.on('connection', (socket) => {
  console.log('ユーザー接続:', socket.id);

  socket.on('newPlayer', () => {
    players[socket.id] = { x: 100, y: 100 };
    io.emit('updatePlayers', players);
  });

  socket.on('move', (direction) => {
    const player = players[socket.id];
    if (player) {
      if (direction === 'left') player.x -= 5;
      if (direction === 'right') player.x += 5;
      if (direction === 'up') player.y -= 5;
      if (direction === 'down') player.y += 5;
      io.emit('updatePlayers', players);
    }
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('updatePlayers', players);
  });
});

http.listen(3000, () => {
  console.log('サーバーがポート3000で起動しました');
});
