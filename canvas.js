const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const colors = ['white', 'grey', 'lightgrey']

canvas.width = window.innerWidth; // Sets canvas width to window width
canvas.height = window.innerHeight; // Sets canvas height to window height

let mousePosition = {
  x: undefined,
  y: undefined
};

// Listens for mouse movement and sets x and y values to our mousePosition object
window.addEventListener("mousemove", e => {
  mousePosition.x = e.x;
  mousePosition.y = e.y;
});

// Listens for window resize and resets canvas height accordingly
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Declare a Circle object
function Circle(radius, x, y, dx, dy, color) {
  this.radius = radius;
  this.x = x; // Position along x-axis
  this.y = y; // Position along y-axis
  this.dx = dx; // x-velocity
  this.dy = dy; // y-velocity
  this.color = colors[Math.floor(Math.random() * colors.length)];
  this.minRadius = radius; // Helpful so that we can make circles return to their original state later on
}

// Draws a circle when invoked
Circle.prototype.draw = function() {
  c.beginPath();
  c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  c.fillStyle = this.color;
  c.fill();
};

// Updates our circles in various ways when invoked
Circle.prototype.update = function() {
  // Bounce circles off x-axis walls
  if (this.x + this.radius > window.innerWidth || this.x - this.radius < 0) {
    this.dx = -this.dx;
  }
  // Bounce circles off y-axis walls
  if (this.y + this.radius > window.innerHeight || this.y - this.radius < 0) {
    this.dy = -this.dy;
  }

  // Sets circles velocity -- makes them move!
  this.x += this.dx;
  this.y += this.dy;

  // Interactivity; Updates circles based on the mouseArea
  let mouseArea = 60;
  if (
    mousePosition.x - this.x < mouseArea &&
    mousePosition.x - this.x > -mouseArea &&
    mousePosition.y - this.y < mouseArea &&
    mousePosition.y - this.y > -mouseArea
  ) {
    // Circle Growth
    if (this.radius < maxRadius) {
      let innerGrowth = 5; // 1st statement: Grows all circles central enough to expand quickly
      let outerGrowth = 1; // 2nd statement: Grows all circles not central enough to expand quickly
      if (
        this.x + maxRadius + innerGrowth < window.innerWidth &&
        this.y + maxRadius + innerGrowth < window.innerHeight &&
        !(this.x - maxRadius - innerGrowth < 0) &&
        !(this.y - maxRadius - innerGrowth < 0)
      ) {
        this.radius += innerGrowth; // 1st Statement
      } else if (
        this.x + this.radius + outerGrowth < window.innerWidth &&
        this.y + this.radius + outerGrowth < window.innerHeight &&
        !(this.x - this.radius - outerGrowth < 0) &&
        !(this.y - this.radius - outerGrowth < 0)
      ) {
        this.radius += outerGrowth; // 2nd Statement
      }
    }
    // Circle Shrinkage
  } else if (this.radius > this.minRadius) {
    this.radius -= 3;
  }

  // Call draw function on this object
  this.draw();
};

// Vars for editing circle properties
let numberOfCircles = 1000;
let maxRadius = 15;
let circleArray = [];

function init() {
  // Creates our circles with random values!
  for (let i = 0; i < numberOfCircles; i++) {
    let radius = Math.random() * 2 + 3;
    let x = Math.random() * (window.innerWidth - radius * 2) + radius; // Spawns circle anywhere along x-axis window minus the circle size
    let y = Math.random() * (window.innerHeight - radius * 2) + radius; // Spawns circle anywhere along y-axis window minus the circle size
    let dx = (Math.random() - 0.5) * 1; // Sets a starting velocity in either left or right direction
    let dy = (Math.random() - 0.5) * 1; // Sets a starting velocity in either up or down direction
    let color = colors[Math.floor(Math.random() * colors.length)];
    circleArray.push(new Circle(radius, x, y, dx, dy, color));
  }
}

// Declares animate function
function animate() {
  requestAnimationFrame(animate); // Creates loop with callback function 'animate'
  c.clearRect(0, 0, window.innerWidth, window.innerHeight); // Clears canvas when called

  for (let i = 0; i < circleArray.length; i++) {
    // Calls update method of Circle on every circle when animate is called
    circleArray[i].update();
  }
}

// Animates our circles!
init();
animate();
