const numBalls = 2;
const spring = 0.05;
const friction = -1;
const balls = [];
const letters = ["C", "S"]
const mobile = window.innerWidth < 360

function setup() {
  const canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent('overlay')
  letters.forEach((letter, i) => {
    balls.push(
      new Ball(
        random(width),
        random(height),
        random(30, 70),
        i,
        balls,
        letter
      )
    )
  }
  )
  noStroke();
  textSize(mobile ? 128 : 256);
  textFont('Poppins')
  textAlign(CENTER, CENTER);
}

function draw() {
  background(0);
  balls.forEach(ball => {
    ball.collide();
    ball.move();
    ball.display();
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Ball {
  constructor(xin, yin, _din, idin, oin, letter) {
    this.x = xin;
    this.y = yin;
    this.vx = mobile? 1 : 3;
    this.vy = mobile? 1 : 3;
    this.diameter = mobile? 100 : 150;
    this.id = idin;
    this.others = oin;
    this.letter = letter;
  }

  collide() {
    balls.forEach((ball, i) => {
      let dx = this.others[i].x - this.x;
      let dy = this.others[i].y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = this.others[i].diameter / 2 + this.diameter / 2;
      if (distance < minDist) {
        let angle = atan2(dy, dx);
        let targetX = this.x + cos(angle) * minDist;
        let targetY = this.y + sin(angle) * minDist;
        let ax = (targetX - this.others[i].x) * spring;
        let ay = (targetY - this.others[i].y) * spring;
        this.vx -= ax;
        this.vy -= ay;
        this.others[i].vx += ax;
        this.others[i].vy += ay;
      }
    })
    
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x + this.diameter / 2 > width) {
      this.x = width - this.diameter / 2;
      this.vx *= friction;
    } else if (this.x - this.diameter / 2 < 0) {
      this.x = this.diameter / 2;
      this.vx *= friction;
    }
    if (this.y + this.diameter / 2 > height) {
      this.y = height - this.diameter / 2;
      this.vy *= friction;
    } else if (this.y - this.diameter / 2 < 0) {
      this.y = this.diameter / 2;
      this.vy *= friction;
    }
  }

  display() {
    text(this.letter, this.x, this.y);
    erase();
  }
}

function reveal() {
  overlayDiv.classList.add('going')
  setTimeout(() => overlayDiv.classList.add('gone'),1000)
}

const overlayDiv = document.querySelector('#overlay');

document.addEventListener('click', reveal)
document.addEventListener('touchstart', reveal)
