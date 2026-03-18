const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1200;
canvas.height = 500;

ctx.translate(0, canvas.height);
ctx.scale(1, -1);

let x0, y0, x, y, v0, angle, rad, a;
let v0x, v0y, ax, ay, vx, vy;
let g = 9.8; // прискорення вільного падіння
let t = 1;
let dt = 1 / 20; // fps
let color;

function startSimulation() {
  x0 = parseFloat(document.getElementById("x0").value);
  y0 = parseFloat(document.getElementById("y0").value);
  v0 = parseFloat(document.getElementById("v0").value);
  angle = parseFloat(document.getElementById("angle").value);
  a = parseFloat(document.getElementById("a").value);

  x = x0;
  y = y0;
  rad = angle * Math.PI / 180;

  v0x = v0 * Math.cos(rad);
  v0y = v0 * Math.sin(rad);

  ax = a;
  ay = -g;

  t = 1;

  animate();
}



function drawPoint(x, y) {
  color = document.getElementById("point-color").value;
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function animate() {

  x = x0 + v0x * t + (ax * t * t) / 2;
  y = y0 + v0y * t + (ay * t * t) / 2;

  vx = v0x + ax * t;
  vy = v0y + ay * t;

  drawPoint(x, y);
  document.getElementById("info-x").textContent = `x: ${x.toFixed(2)}`;
  document.getElementById("info-y").textContent = `y: ${y.toFixed(2)}`;
  document.getElementById("info-vx").textContent = `vx: ${vx.toFixed(2)}`;
  document.getElementById("info-vy").textContent = `vy: ${vy.toFixed(2)}`;

  t += dt;

  if (y >= 0) {
    requestAnimationFrame(animate);
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("info-x").textContent = `x:`;
  document.getElementById("info-y").textContent = `y:`;
  document.getElementById("info-vx").textContent = `vx:`;
  document.getElementById("info-vy").textContent = `vy:`;
}

animate();

