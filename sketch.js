var sound = { A: null, B: null, C: null };
let pvSlider;
let delay1, delay2, delay3;
let delayTimeSlider1, delayTimeSlider2, delayTimeSlider3;
let autoButton1, autoButton2, autoButton3;
let autoMode1 = false, autoMode2 = false, autoMode3 = false;

let noiseOffsetA = 0.0, noiseSpeedA = 0.01;
let noiseOffsetB = 10.0, noiseSpeedB = 0.005;
let noiseOffsetC = 2000.0, noiseSpeedC = 0.02;

let speedSlider1, speedSlider2, speedSlider3;

let recorder, soundFile;
let isRecording = false;

function preload() {
 
  sound.A = loadSound("RullyShabaraSampleT04.mp3", "RullyShabraSampleT10.wav");
  sound.B = loadSound("RullyShabaraSampleT05.mp3", "RullyShabraSampleT08.wav");
  sound.C = loadSound("RullyShabraSampleT09.wav", "RullyShabaraSampleT05.wav");
}


function setup() {
 
  createCanvas(770, 500);

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
  
  delayTimeSlider1.style('width', '200px');
delayTimeSlider1.style('background', '#ff0000'); // Red for A
delayTimeSlider2.style('width', '200px');
delayTimeSlider2.style('background', '#00ff00'); // Green for B
delayTimeSlider3.style('width', '200px');
delayTimeSlider3.style('background', '#0000ff'); // Blue for C
  
  speedSlider1 = createSlider(0.001, 0.05, 0.01, 0.001);
speedSlider1.position(20, 75);
speedSlider1.hide();

speedSlider2 = createSlider(0.001, 0.05, 0.015, 0.001);
speedSlider2.position(230, 75);
speedSlider2.hide();

speedSlider3 = createSlider(0.001, 0.05, 0.02, 0.001);
speedSlider3.position(440, 75);
speedSlider3.hide();
  
  speedSlider1.style('width', '200px');
speedSlider1.style('background', '#ff0000'); // Red for A
speedSlider2.style('width', '200px');
speedSlider2.style('background', '#00ff00'); // Green for B
speedSlider3.style('width', '200px');
speedSlider3.style('background', '#0000ff'); // Blue for C

 



delayTimeSlider1.input(() => {
  delay1.delayTime(delayTimeSlider1.value());
});

delayTimeSlider2.input(() => {
  delay2.delayTime(delayTimeSlider2.value());
});

delayTimeSlider3.input(() => {
  delay3.delayTime(delayTimeSlider3.value());
});

  recorder = new p5.SoundRecorder();
  soundFile = new p5.SoundFile();
  
  // NEW: Button for saving the sample
  saveButton = createButton('Save Sample');
  saveButton.position(670, 35);
  saveButton.mousePressed(toggleRecording);
  
  saveButton.style('background-color', '#FF5733'); // A vibrant orange
saveButton.style('color', '#ffffff'); // White text
saveButton.style('border', 'none'); // No border for a modern look
saveButton.style('padding', '10px 10px'); // Some padding for aesthetics
saveButton.style('font-size', '10px'); // Bigger text
saveButton.style('border-radius', '8px'); // Rounded corners for a touch of elegance
saveButton.style('cursor', 'pointer');
  
  autoButton1 = createButton('Xhabarabot Mode A');
autoButton1.position(25, 40);
autoButton1.mousePressed(() => { 
  autoMode1 = !autoMode1; 
  autoMode1 ? speedSlider1.show() : speedSlider1.hide();
});

// Styling buttons
styleAutoButton(autoButton1, '#D15050');  // Red for A

autoButton2 = createButton('Xhabarabot Mode B');
autoButton2.position(235, 40);
autoButton2.mousePressed(() => { 
  autoMode2 = !autoMode2; 
  autoMode2 ? speedSlider2.show() : speedSlider2.hide();
});

styleAutoButton(autoButton2, '#BDB253');  // Yellow for B

autoButton3 = createButton('Xhabarabot Mode C');
autoButton3.position(445, 40);
autoButton3.mousePressed(() => { 
  autoMode3 = !autoMode3; 
  autoMode3 ? speedSlider3.show() : speedSlider3.hide();
});

styleAutoButton(autoButton3, '#29AD2F');  // Green for C
}

function styleAutoButton(button, bgColor) {
  button.style('background-color', bgColor);
  button.style('color', '#0F0F0F');  // White text
  button.style('border', 'none');  // No border for a modern look
  button.style('padding', '8px 8px');  // Some padding for aesthetics
  button.style('font-size', '10px');  // Bigger text
  button.style('border-radius', '8px');  // Rounded corners for elegance
  button.style('cursor', 'pointer');  // Change cursor to pointer on hover



}

function toggleRecording() {
  if (!isRecording) {
    recorder.record(soundFile);
    saveButton.html('Stop Recording');
    isRecording = true;
  } else {
    recorder.stop();
    saveButton.html('Download');
    soundFile.save('XhabarabotDronex.wav');  // Save the sound file
    isRecording = false;
  }
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
  
 if (autoMode1) {
  noiseSpeedA = speedSlider1.value();
  pvSlider.A.pos.x = noise(noiseOffsetA);
  pvSlider.A.pos.y = noise(noiseOffsetA + 70);
  noiseOffsetA += noiseSpeedA;
}
if (autoMode2) {
  noiseSpeedB = speedSlider2.value();
  pvSlider.B.pos.x = noise(noiseOffsetB);
  pvSlider.B.pos.y = noise(noiseOffsetB + 500);
  noiseOffsetB += noiseSpeedB;
}
if (autoMode3) {
  noiseSpeedC = speedSlider3.value();
  pvSlider.C.pos.x = noise(noiseOffsetC);
  pvSlider.C.pos.y = noise(noiseOffsetC + 10);
  noiseOffsetC += noiseSpeedC;
}


}

function mousePressed() {

  // Your existing code for playing audio
  for (const [key, audio] of Object.entries(sound)) {
    if (!audio.isPlaying()) {
      audio.setLoop(true);
      audio.play();
    }
  }

  // Updated logic for taking control of sliders
  if (!autoMode1 && pvSlider.A.hover) pvSlider.A.control = true;
  if (!autoMode2 && pvSlider.B.hover) pvSlider.B.control = true;
  if (!autoMode3 && pvSlider.C.hover) pvSlider.C.control = true;
}


function mouseReleased() {
  if (!autoMode1) pvSlider.A.control = false;
  if (!autoMode2) pvSlider.B.control = false;
  if (!autoMode3) pvSlider.C.control = false;
}


function keyPressed() {
  if (key == " ") {
    for (const [key, audio] of Object.entries(sound)) {
      audio.setLoop(false);
    }
  }
}

function windowResized() {
  resizeCanvas(770,500);
}

// Created by Rully Shabara
// pvSliders and Wave Vectors designed by Louis Marcellino
