const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1200;
canvas.height = 500;

ctx.translate(0, canvas.height);
ctx.scale(1, -1);

let x0, y0, x, y, v0, angle, rad, a;
let v0x, v0y, ax, ay, vx, vy;
let g = 9.8; // прискорення вільного падіння
let t = 0;
let dt = 1 / 20; // fps
let color;

let points = [];
let scaleFactor;
const tooltip = document.getElementById("tooltip");

function drawGrid() {
  scaleFactor = parseFloat(document.getElementById("scale").value);

  const step = scaleFactor * 10;

  ctx.save();
  ctx.strokeStyle = "#f0a500";
  ctx.lineWidth = 1;

  for (let y = 0; y < canvas.height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();

    ctx.save();
    ctx.scale(1, -1);

    ctx.fillStyle = "#f0a500";
    let value = (y / scaleFactor);
    ctx.fillText((value).toFixed(0), 2, -y - 2);

    ctx.restore();
  }

  for (let x = 0; x < canvas.width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();

    ctx.save();
    ctx.scale(1, -1);

    ctx.fillStyle = "#f0a500";
    let value = (x / scaleFactor);
    ctx.fillText((value).toFixed(0), x + 2, -2);

    ctx.restore();
  }

  ctx.restore();
}

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

  t = 0;

  let t_total = (2 * v0y) / g;
  let maxHeight = (v0y * v0y) / (2 * g);
  let distance = v0x * t_total + (ax * t_total * t_total) / 2;

  document.getElementById("info-t").textContent = `t: ${t_total.toFixed(2)}`;
  document.getElementById("info-l").textContent = `l: ${distance.toFixed(2)}`;
  document.getElementById("info-h").textContent = `h: ${maxHeight.toFixed(2)}`;

  animate();
}


function drawPoint(x, y) {
  ctx.beginPath();
  ctx.arc(x * scaleFactor, y * scaleFactor, scaleFactor, 0, Math.PI * 2);
  ctx.fillStyle = document.getElementById("point-color").value;
  ctx.fill();

  points.push({ x: x, y: y });
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
  drawGrid();
  document.getElementById("info-x").textContent = `x: 0`;
  document.getElementById("info-y").textContent = `y: 0`;
  document.getElementById("info-vx").textContent = `vx: 0`;
  document.getElementById("info-vy").textContent = `vy: 0`;
  document.getElementById("info-t").textContent = `t: 0`;
  document.getElementById("info-l").textContent = `l: 0`;
  document.getElementById("info-h").textContent = `h: 0`;
}


canvas.addEventListener("mousemove", function (event) {
  const rect = canvas.getBoundingClientRect();
  let mouseX = (event.clientX - rect.left) / scaleFactor;
  let mouseY = event.clientY - rect.top;
  mouseY = (canvas.height - mouseY) / scaleFactor;
  console.log(mouseX, mouseY);

  let foundPoint = null;


  for (let p of points) {

    if (Math.abs(mouseX - p.x) < scaleFactor && Math.abs(mouseY - p.y) < scaleFactor) {
      foundPoint = p;
      break;
    }
  }

  if (foundPoint) {
    tooltip.style.display = "block";
    tooltip.style.left = event.clientX + 10 + "px";
    tooltip.style.top = event.clientY + 10 + "px";
    tooltip.innerText = `x: ${foundPoint.x}, y: ${foundPoint.y}`;
  } else {
    tooltip.style.display = "none";
  }
});

drawGrid();
