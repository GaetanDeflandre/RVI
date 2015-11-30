/**
 * TP three.js
 * Université Lille 1 - M2 IVI - RVI
 *
 * **/
 
 window.addEventListener('load',main,false);

var renderer;
var canvas;


function main(event) {
	init();
	loop();
}

function init() {
	canvas = document.getElementById("webglCanvas");
}


function updateData() {
}


function drawScene() {
}


function loop() {
	var raf=window.requestAnimationFrame || window.mozRequestAnimationFrame || webkitRequestAnimationFrame;
	drawScene();
	updateData();
	raf(loop); 
}

