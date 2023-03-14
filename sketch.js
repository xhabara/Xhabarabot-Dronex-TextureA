var sound = { A: null, B: null, C: null };
let pvSlider;
let delay1, delay2, delay3;
let delayTimeSlider1, delayTimeSlider2, delayTimeSlider3;

function preload() {
 
  sound.A = loadSound("RullyShabaraSampleT04.mp3", "RullyShabraSampleT10.wav");
  sound.B = loadSound("RullyShabaraSampleT05.mp3", "RullyShabraSampleT08.wav");
  sound.C = loadSound("RullyShabraSampleT09.wav", "RullyShabaraSampleT05.wav");
}

function setup() {
 
  createCanvas(600, 600);

  colorMode(HSB, 690, 200, 100, 100);

  
  for (const [key, audio] of Object.entries(sound)) {
    audio.setLoop(true);
  }

  amp = new p5.Amplitude();
  
  delay1 = new p5.Delay();
  delay1.process(sound.A, 0.12, 0.7, 2300);
  delay2 = new p5.Delay();
  delay2.process(sound.B, 0.12, 0.7, 2300);
  delay3 = new p5.Delay();
  delay3.process(sound.C, 0.12, 0.7, 2300);

  pvSlider = {
    A: { pos: createVector(0.10, 0.95), hover: false, control: false },
    B: { pos: createVector(0.50, 0.95), hover: false, control: false },
    C: { pos: createVector(0.90, 0.95), hover: false, control: false },
  };

  delayTimeSlider1 = createSlider(0, 1, 0, 0.01);
  delayTimeSlider1.position(20, 10);
  delayTimeSlider2 = createSlider(0, 1, 0, 0.01);
  delayTimeSlider2.position(230, 10);
  delayTimeSlider3 = createSlider(0, 1, 0, 0.01);
  delayTimeSlider3.position(440, 10);
  
 
delayTimeSlider1.input(() => {
  delay1.delayTime(delayTimeSlider1.value());
});

delayTimeSlider2.input(() => {
  delay2.delayTime(delayTimeSlider2.value());
});

delayTimeSlider3.input(() => {
  delay3.delayTime(delayTimeSlider3.value());
});

}

function draw() {
  background(
    0,
    0,
    25 + 50 * (1.0 - (pvSlider.A.pos.y + pvSlider.B.pos.y + pvSlider.C.pos.y) / 3)
  );

  let mousePos = createVector(mouseX, mouseY, 1),
    resolution = createVector(width, height, 1);

  noStroke();
  for (let i = 0; i < 3; i++) {
    fill(((i + 1) / 3) * 100);
    // rect((width / 3) * i, 0, width / 3, height);
  }

  let wave = sin(millis() / 1000);

  var p0 = createVector(0, height);
  var p1 = p5.Vector.mult(pvSlider.A.pos, resolution);
  var p2 = p5.Vector.mult(pvSlider.B.pos, resolution);
  var p3 = p5.Vector.mult(pvSlider.C.pos, resolution);
  var p4 = createVector(width, height);

 
  
  push();
  for (let n = 0; n < 4; n += 1) {
    blendMode(OVERLAY);

    switch (n) {
      case 1:
        fill(0, 100, 100, 75);
        p1.y = pvSlider.A.pos.y * resolution.y;
        p2.y = height;
        p3.y = height;
        break;
      case 2:
        fill(120, 100, 100, 75);
        p1.y = height;
        p2.y = pvSlider.B.pos.y * resolution.y;
        p3.y = height;
        break;
      case 3:
        fill(240, 100, 100, 75);
        p1.y = height;
        p2.y = height;
        p3.y = pvSlider.C.pos.y * resolution.y;
        break;
      default:
        fill(0, 0, 75, 50);
    }

    beginShape();
    for (let t = 0; t <= 1.001; t += 0.02) {
      let Ap1 = p5.Vector.lerp(p0, p1, t);
      let Ap2 = p5.Vector.lerp(p1, p2, t);
      let Ap3 = p5.Vector.lerp(p2, p3, t);
      let Ap4 = p5.Vector.lerp(p3, p4, t);

      let Bp1 = p5.Vector.lerp(Ap1, Ap2, t);
      let Bp2 = p5.Vector.lerp(Ap2, Ap3, t);
      let Bp3 = p5.Vector.lerp(Ap3, Ap4, t);

      let Cp1 = p5.Vector.lerp(Bp1, Bp2, t);
      let Cp2 = p5.Vector.lerp(Bp2, Bp3, t);

      let fp = p5.Vector.lerp(Cp1, Cp2, t);

      vertex(fp.x, fp.y);
    }
    endShape();
  }
  pop();

  strokeWeight(4);
  for (const [key, slider] of Object.entries(pvSlider)) {
    switch (key) {
      case "A":
        fill(0, 100, 100, 75);
        break;
      case "B":
        fill(120, 100, 100, 75);
        break;
      case "C":
        fill(240, 100, 100, 75);
        break;
      default:
        fill(0, 0, 75, 50);
    }

    slider.size = max(width, height) / 32;
    finalPos = p5.Vector.mult(slider.pos, resolution);

    if (finalPos.dist(mousePos) < slider.size / 2) slider.hover = true;
    else slider.hover = false;

    if (slider.control) {
      slider.pos = p5.Vector.div(mousePos, resolution);
      slider.pos.x = min(max(slider.pos.x, 0), 1);
      slider.pos.y = min(max(slider.pos.y, 0), 1);
    }

    if (slider.hover) stroke(100);
    circle(finalPos.x, finalPos.y, slider.size);
    noStroke();
  }

  for (const [key, audio] of Object.entries(sound)) {
    audio.rate(0.5 + pvSlider[key].pos.x * 1.5);
    audio.setVolume(1.0 - pvSlider[key].pos.y);
  }
}

function mousePressed() {

  for (const [key, audio] of Object.entries(sound)) {
    if (!audio.isPlaying()) {
      audio.setLoop(true);
      audio.play();
    }
  }

  for (const [key, slider] of Object.entries(pvSlider)) {
    if (slider.hover) slider.control = true;
  }
}

function mouseReleased() {
  for (const [key, slider] of Object.entries(pvSlider)) {
    if (slider.control) slider.control = false;
  }
}

function keyPressed() {
  if (key == " ") {
    for (const [key, audio] of Object.entries(sound)) {
      audio.setLoop(false);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
