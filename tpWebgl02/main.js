/**
* TP three.js
* Université Lille 1 - M2 IVI - RVI
*
* **/

window.addEventListener('load',main,false);

var canvas;
var renderer;
var scene;
var camera;
var boxes = new Array();
var nbBoxes = 1000;

var pitchIncUpdate, pitchDecUpdate = false;
var rollIncUpdate, rollDecUpdate = false;
var velocityIncUpdate, velocityDecUpdate = false;
var reset = false;

var velocity = 0;

var mouse = new THREE.Vector2();
var mouseOld = new THREE.Vector2();
var mouseDelta = new THREE.Vector2();
var clickHold = false;

// MAIN
// ====

function main(event) {
  init();
  loop();
}


// EVENT
// =====

function handleKeyUp(event) {
  switch (event.keyCode) {
    case 90 /* z */: pitchIncUpdate=false;break;
    case 83 /* s */: pitchDecUpdate=false;break;
    case 81 /* q */: rollIncUpdate=false;break;
    case 68 /* d */: rollDecUpdate=false;break;
    case 65 /* a */: velocityDecUpdate=false;break;
    case 69 /* e */: velocityIncUpdate=false;break;
    case 82 /* r */: reset=false;break;
  }
}

function handleKeyDown(event) {
  switch (event.keyCode) {
    case 90 /* z */: pitchIncUpdate=true;break;
    case 83 /* s */: pitchDecUpdate=true;break;
    case 81 /* q */: rollIncUpdate=true;break;
    case 68 /* d */: rollDecUpdate=true;break;
    case 65 /* a */: velocityDecUpdate=true;break;
    case 69 /* e */: velocityIncUpdate=true;break;
    case 82 /* r */: reset=true;break;
  }
}

function handleMouseDown(event) {
  mouseOld.x = ( event.layerX / canvas.width ) * 2 - 1;
  mouseOld.y = - ( event.layerY / canvas.height ) * 2 + 1;
  clickHold = true;
}

function handleMouseUp(event) {
  clickHold = false;
}

function handleMouseMove(event) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = ( event.layerX / canvas.width ) * 2 - 1;
  mouse.y = - ( event.layerY / canvas.height ) * 2 + 1;

  mouseDelta.x = mouse.x - mouseOld.x;
  mouseDelta.y = mouse.y - mouseOld.y;
  mouseOld.x = mouse.x;
  mouseOld.y = mouse.y;
  console.log(mouseDelta);
}


// INITIALIZE
// ==========

function init() {

  // event
  window.addEventListener("keyup",handleKeyUp,false);
  window.addEventListener("keydown",handleKeyDown,false);

  // récupère la balise canvas de votre page html
  canvas = document.getElementById("webglCanvas");

  // callback for mouse events
  canvas.addEventListener('mousedown', handleMouseDown, false);
  canvas.addEventListener('mousemove', handleMouseMove, false);
  canvas.addEventListener('mouseup', handleMouseUp, false);

  // créé le renderer pour votre canvas
  renderer = new THREE.WebGLRenderer({canvas : canvas});
  // couleur en héxa; alpha (opacité) = 1.0
  renderer.setClearColor(new THREE.Color(0xeeeeee), 1.0);

  // créé une scène vide
  scene = new THREE.Scene();

  // créé une caméra
  camera = new THREE.PerspectiveCamera(45, 1.0, 0.1, 1000);

  // rayon, nombre de méridiens et parallèles
  var geometry = new THREE.BoxGeometry(1, 1, 1);

  for (var i = 0; i < nbBoxes; i++) {

    // réflexion diffuse
    var material = new THREE.MeshLambertMaterial({ color : Math.random()*0xFFFFFF});

    // création de la sphere
    boxes.push(new THREE.Mesh(geometry, material));
    //boxes[i].rotateOnAxis((new THREE.Vector3(0,1,0)).normalize(),0.6);

    // un objet au centre
    if (i != 0){
      var x = Math.random()*100.0 - 50.0;
      var y = Math.random()*100.0 - 50.0;
      var z = Math.random()*100.0 - 50.0;
      var t = 1;
      boxes[i].translateOnAxis(new THREE.Vector3(x,y,z),t);
    }


    // ajoute la sphère à la racine du graphe de scène
    scene.add(boxes[i]);
  }

  // on recule la camera
  camera.position.z += 50;

  // couleur d'éclairement
  var pointLight = new THREE.PointLight(0xFFFFFF);
  // pour la positionner
  pointLight.position.z = 200;
  // ajout de lumière dans la scène
  scene.add(pointLight);

  console.log("Type 'r' to reset speed");
}


// LOOP
// ====
function updateData() {

  // CAMERA FLY
  // ----------
  if (rollIncUpdate && !rollDecUpdate) {
    camera.rotateOnAxis((new THREE.Vector3(0,0,1)).normalize(), 0.005);
  } else if (rollDecUpdate && !rollIncUpdate) {
    camera.rotateOnAxis((new THREE.Vector3(0,0,1)).normalize(),-0.005);
  }

  if (pitchIncUpdate && !pitchDecUpdate) {
    camera.rotateOnAxis((new THREE.Vector3(1,0,0)).normalize(),-0.005);
  } else if (pitchDecUpdate && !pitchIncUpdate) {
    camera.rotateOnAxis((new THREE.Vector3(1,0,0)).normalize(), 0.005);
  }

  if (velocityIncUpdate && !velocityDecUpdate) {
    velocity -= 0.05;
  } else if (velocityDecUpdate && !velocityIncUpdate) {
    velocity += 0.05;
  }

  if (reset){
    velocity = 0;
  }

  camera.translateOnAxis(new THREE.Vector3(0,0,1),velocity);

  // SELECTION
  // ---------
  if (clickHold){
    ray=new THREE.Raycaster(new THREE.Vector3(0,0,10),new THREE.Vector3(0,0,-1),0,1000); // rayon d'origine (0,0,0) et de direction(0,0,-1); exprimés dans le repère du monde !
    // changement de repère monde vers camera
    ray.setFromCamera(mouse, camera);
    var arrayIntersect=ray.intersectObjects(scene.children); // intersection rayon avec tous les enfants de la scène : retourne un tableau d'informations sur les objets intersectés

    // s'il y a des objets intersectés
    if (arrayIntersect.length>0) {
      // on prend le premier (intersections ordonnées de
      // la plus proche à la plus lointaine de l'origine du rayon
      var first = arrayIntersect[0];
      // la distance depuis l'origine
      //console.log(first.distance);
      // coordonnées du point intersecté; repère du monde !
      //console.log(first.point);
      // .object : donne le noeud (i.e. l'object3D) intersecté
      selected = first.object;

      console.log(mouseDelta);

      //selected.rotation.z += 0.1;
      selected.position.x += mouseDelta.x*10;
      selected.position.y += mouseDelta.y*10;

    }
  }

}


function drawScene() {
  // rendu de la scène par la camera globale
  renderer.render(scene, camera);
}


function loop() {
  var raf=window.requestAnimationFrame || window.mozRequestAnimationFrame || webkitRequestAnimationFrame;
  drawScene();
  updateData();
  raf(loop);
}
