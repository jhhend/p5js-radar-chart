
/*

Font created by Raymond Larabie:                    https://www.1001fonts.com/vinque-font.html
RPG Sprites created by Redshrike:                   https://opengameart.org/users/redshrike
getArea and mouseInTriangle functions by Rabbid76:  https://stackoverflow.com/a/72396449

*/

// Global Scrope Variables

let statValues = { };
let prevStatValues = { };
const monsters = {
  "Cave Spider" : {
    health : 0.2,
    strength : 0.3,
    intelligence : 0.1,
    agility : 0.8,
    magic : 0.1,
    desc : 'Poisonous arachnid lurking in dark places.'
  },
  "Teal Wasp" : {
    health : 0.4,
    strength : 0.4,
    intelligence : 0.2,
    agility : 0.6,
    magic : 0.3,
    desc : 'Aggressive insect with a deadly stinger.'       
  },
  "Goblin" : {
    health : 0.6,
    strength : 0.6,
    intelligence : 0.3,
    agility : 0.4,
    magic : 0.2,
    desc : 'Small and devious creature, fond of mischief.'     
  },
  "Skeleton" : {
    health : 0.5,
    strength : 0.7,
    intelligence : 0.1,
    agility : 0.4,
    magic : 0.1,
    desc: 'Animated bones of the deceased, brought back to life.'       
  },
  "Hooded Mage" : {
    health : 0.4,
    strength : 0.3,
    intelligence : 0.9,
    agility : 0.3,
    magic : 0.9,
    desc : 'Powerful sorcerer, shrouded in mystery.'       
  },
  "Ancient Reptile" : {
    health : 0.9,
    strength : 0.9,
    intelligence : 0.4,
    agility : 0.5,
    magic : 0.1,
    desc : 'Ferocious dinosaur, ancient and dangerous.'       
  },
  "Slime" : {
    health : 0.3,
    strength : 0.2,
    intelligence : 0.1,
    agility : 0.1,
    magic : 0.1,
    desc : 'Oozing mass of acidic goo. Disgusting!'       
  },
  "Air Serpent" : {
    health : 0.5,
    strength : 0.3,
    intelligence : 0.6,
    agility : 0.9,
    magic : 0.8,
    desc : 'Serpentine dragon, capable of controlling the winds.'       
  },
  "Demon Eye" : {
    health : 0.8,
    strength : 0.5,
    intelligence : 0.1,
    agility : 0.7,
    magic : 0.8,
    desc : 'Malevolent orb of darkness and evil magic.'   
  },
  "Swamp Thing" : {
    health : 0.9,
    strength : 0.8,
    intelligence : 0.2,
    agility : 0.2,
    magic : 0.3,
    desc : 'Monstrous creature, made of mud and vegetation.'   
  }
}
const statOrder = [ "health", "strength", "intelligence", "agility", "magic" ];
const monsterNames = Object.keys(monsters).sort();
const buttons = [ ];
let lerpVal = 0;





// p5.js Functions

function preload() {

  // Load the images for each monster
  // Todo figure out the image scaling issue
  monsterNames.forEach(name => {
    let img = loadImage(`public/${name}.png`);
    img.loadPixels();
    monsters[name]["sprite"] = img;
  })

  fnt = loadFont('public/vinque rg.otf');

}

function setup() {
  preload();

  createCanvas(800, 900);
  textFont(fnt)

  // Select the first monster and set the default values for the stat objects
  currentMonster = monsterNames[0];
  statOrder.forEach(stat => {
    statValues[stat] = monsters[currentMonster][stat];
    prevStatValues[stat] = 0;
  });

  // Create the coordinates for the buttons
  let buttonBase = { x : width/2, y : ((512 + 64 + 8 + 64 + height) / 2)}
  let buttonVal = 24;
  let buttonDistance = 256
  const draw = (coords) => {
    triangle(coords[0].x, coords[0].y, coords[1].x, coords[1].y, coords[2].x, coords[2].y)
  }
  buttons.push({
    coords : [ 
      { x : buttonBase.x - buttonDistance, y : buttonBase.y - buttonVal },
      { x : buttonBase.x - buttonDistance - buttonVal, y : buttonBase.y },
      { x : buttonBase.x - buttonDistance, y : buttonBase.y + buttonVal },      
    ],
    drawCheck : v => v != 0,
    newValue : v => v - 1,
    draw : draw
  })
  buttons.push({
    coords : [ 
      { x : buttonBase.x + buttonDistance, y : buttonBase.y - buttonVal },
      { x : buttonBase.x + buttonDistance + buttonVal, y : buttonBase.y },
      { x : buttonBase.x + buttonDistance, y : buttonBase.y + buttonVal },      
    ],
    drawCheck : v => v != monsterNames.length - 1,
    newValue : v => v + 1,
    draw : draw
  })

}

function mousePressed() {

  const mouseInTriangle = (coords) => {
    const getArea = (a, b, c) => {
      return abs((a[0]*(b[1]-c[1]) + b[0]*(c[1]-a[1])+ c[0]*(a[1]-b[1]))/2);
    }

    let [ x1, y1, x2, y2, x3, y3 ] = coords.reduce((prev, cur) => {
      prev.push(cur.x);
      prev.push(cur.y);
      return prev;
    }, [ ]);

    let point = [mouseX, mouseY];
    let area = getArea([x1, y1], [x2, y2], [x3, y3]);
    let areaA = getArea([x1, y1], [x2, y2], point);
    let areaB = getArea(point, [x2, y2], [x3, y3]);
    let areaC = getArea([x1, y1], point, [x3, y3]);
    return abs(areaA + areaB + areaC - area) < 0.001;
  }

  let monsterIdx = monsterNames.indexOf(currentMonster);

  // Check for mouse in each button
  buttons.forEach(button => {
    if (!button.drawCheck(monsterIdx)) {
      return;
    }

    if (mouseInTriangle(button.coords)) {
      updateCurrentMonster(monsterNames[button.newValue(monsterIdx)]);
    }

  });
}

function draw() {
  background(51);
  stroke(255)
  for (let i = 0; i < 10; i++) {
    drawPentagon(width/2, height*(2/5), ((64*4)/10)*(i + 1), (i + 1) % 2 != 0, lines=(i == 9));
  }


  drawStatShape(width/2, height*(2/5), 64*4);

  // Text
  noStroke()
  fill(color(200, 200, 0));
  textSize(32);
  textAlign(CENTER)
  drawLabels(width/2, height*(2/5), 64*(4));
  //textSize(64)
  //text(currentMonster, width/2, 64);

  let midLineY = 512 + 64 + 8;

  stroke(255);
  updateLerp();

  push()
  noStroke()
  fill(color(200, 200, 0))
  textSize(48);
  text(currentMonster, width/2, height*(61/80));
  pop()

  // Draw sprite portrait
  let spriteScale = 3;
  let spriteX = width/2
  let spriteY = ((midLineY + 64 + height) / 2);
  circle(spriteX, spriteY, 8)
  drawScaledImage(monsters[currentMonster].sprite,
    spriteX - spriteScale*monsters[currentMonster].sprite.width/2,
    spriteY - spriteScale*monsters[currentMonster].sprite.height/2,
    spriteScale);

  drawButtons(spriteX, spriteY, 128);

  // Monster flavor text
  push()
  noStroke();
  textSize(32)
  textAlign(CENTER, CENTER)

  text(monsters[currentMonster].desc, width/2, (height + spriteY + spriteScale*monsters[currentMonster].sprite.height/2)/2) 
  pop()
}





// Update Functions

function updateCurrentMonster(newMonster) {
  currentMonster = newMonster;
  prevStatValues = statValues;
  statValues = monsters[currentMonster];
  lerpVal = 0;
}

function updateLerp() {
  if (lerpVal > 1) {
    lerpVal = 1
  } else if (lerpVal != 1) {
    lerpVal += 0.1;
  }
}





// Drawing Functions

function drawButtons(x, y, distance) {

  let monsterIdx = monsterNames.indexOf(currentMonster);

  push();
  noStroke();

  buttons.forEach(button => {
    if (!button.drawCheck(monsterIdx)) {
      return;
    }

    button.draw(button.coords);
  });

  pop();
}

function drawLabels(x, y, distance, buffer=16) {
  push()
  fill(color(200, 200, 0))
  textSize(24)

  for (let i = 0; i < 5; i++) {
    let stat = statOrder[i].split('').map((chr, idx) => {
      if (idx == 0) {
        return chr.toUpperCase()
      }
      return chr;
    }).join('');
    let angle = -PI/2 + i*PI*(2/5);
    let xx = x + cos(angle)*(distance + buffer + (i == 2 || i == 3 ? 12 : 0));
    let yy = y + sin(angle)*(distance + buffer + (i == 2 || i == 3 ? 12 : 0));
    let textAngle;
    switch (i) {
      case 0: textAngle = 0; break;
      case 1: textAngle = PI/3; break;
      case 2: textAngle = -PI/5; break;
      case 3: textAngle = PI/5; break;
      case 4: textAngle = -PI/3; break;
    }


    push()
    translate(xx, yy)
    rotate(textAngle)
    text(stat, 0, 0);
    pop();
  }

  pop();

}

function drawPentagon(x, y, distance, alpha=false, lines=false) {
  push()
  noFill();
  stroke(color(255, 255, 255, alpha ? 64 : 255))
  beginShape()
  for (let i = 0; i < 5; i++) {
    let angle = -PI/2 + i*PI*(2/5);
    vertex(x + cos(angle)*distance, y + sin(angle)*distance)
    if (lines) {
      line(x, y, x + cos(angle)*distance, y + sin(angle)*distance)
    }
  }
  endShape(CLOSE);
  pop();
}

function drawScaledImage(img, x, y, scale=1) {
  img.loadPixels()
  push()
  noStroke();
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      fill(img.get(i, j));
      rect(x + i*scale, y + j*scale, scale, scale);
    }
  }
  pop()
}

function drawStatShape(x, y, distance) {
  push();

  let monster = monsters[currentMonster];

  // Calculate the position of the vertices
  const vertices = statOrder.map((stat, idx) => {
    let angle = -PI/2 + idx*PI*(2/5);
    let statDist = distance*lerp(prevStatValues[stat], statValues[stat], lerpVal)

    return {
      x : x + cos(angle)*statDist,
      y : y + sin(angle)*statDist
    };
  })

  // Draw the main shape
  beginShape()
  fill(color(200, 200, 0, 128))
  vertices.forEach(v => {
    vertex(v.x, v.y);
  })
  endShape(CLOSE);

  // Draw the "end points"
  let hoverStr = "";
  fill(color(200, 200, 0));
  vertices.forEach((v, idx) => {
    push();
    if (dist(mouseX, mouseY, v.x, v.y) < 8) {
      fill(color(255, 0, 0));
        hoverStr = `${100*monster[statOrder[idx]]}`;
    }
    circle(v.x, v.y, 16);
    pop();
  })

  // Draw the label text (if needed)
  if (hoverStr != '') {
    push();
    fill(color(255, 0, 0))
    text(hoverStr, mouseX, mouseY - 8);
    pop();
  }

  pop();
}
