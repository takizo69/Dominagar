(() => {
  const canvas = document.getElementById('agarCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const nickname = 'Takizo';
  const socket = new WebSocket('wss://agar.io/ws');

  socket.onopen = () => {
    socket.send(JSON.stringify({ cmd: 'setNick', nick: nickname }));
  };

  socket.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.cells) draw(data.cells);
  };

  document.addEventListener('touchstart', e => socket.send(JSON.stringify({ cmd: 'eat' })));
  document.addEventListener('touchmove', e => socket.send(JSON.stringify({ cmd: 'move', x: e.touches[0].clientX, y: e.touches[0].clientY })));
  document.addEventListener('touchend', () => socket.send(JSON.stringify({ cmd: 'split' })));

  function draw(cells) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cells.forEach(cell => {
      ctx.fillStyle = cell.owner === nickname ? '#0ff' : '#f00';
      ctx.beginPath();
      ctx.arc(cell.x, cell.y, cell.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }
})();
