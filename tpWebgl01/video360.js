window.addEventListener('load', main, false);

var gl; // will contain the webgl context
var programShader; // video360 program shader

var vertexBuffer; // contain the vertices
var elementBuffer; // contain the indice of each vertex
var colorBuffer; // contain each vertex color
var texCoordBuffer; // contain the texture cordinates
var texture; // the texture image

var modelview;
var projection;

var angle;

/**
 * Init the gl context from the canvas, and some gl settings
 */
function initGL(){

  canvas = document.getElementById("webglCanvas");
  gl = canvas.getContext("webgl");

  if(!gl){
    // failure
    alert("Cannot initialise webgl context");
  } else {
    console.log(gl.getParameter(gl.VERSION) + " | "
      + gl.getParameter(gl.VENDOR) + " | "
      + gl.getParameter(gl.RENDERER) + " | "
      + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
    
    gl.clearColor(0,0,0,1);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  }

}


/**
 * read shaders (read from html elements) and compile
 */ 
function getShader(id){
  var shaderScript = document.getElementById(id);
  var k = shaderScript.firstChild;
  var str = k.textContent;
  var shader;

  if(shaderScript.type == "x-shader/x-fragment"){ 
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex"){
    shader = gl.createShader(gl.VERTEX_SHADER);
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
    alert(gl.getShaderInfoLog(shader));
    return null; 
  } 
  return shader;
}

/**
 * create the program shader (vertex+fragment) : code is read from html elements
 */
function createProgram(id){
  var programShader = gl.createProgram();
  var vert = getShader(id+"-vs");
  var frag = getShader(id+"-fs");

  gl.attachShader(programShader, vert);
  gl.attachShader(programShader, frag);
  gl.linkProgram(programShader);

  if (!gl.getProgramParameter(programShader,gl.LINK_STATUS)){
    alert(gl.getProgramInfoLog(programShader));
    return null;
  }

  console.log("compilation shader ok");
  return programShader;
}


/**
 * return the buffer of vertices
 */
function initVertex(){
  var vertex = [-0.5,-0.5,0.0,
                0.5,-0.5,0.0,
                0.0,0.5,0.0];

  var vertexBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);

  return vertexBuffer;
}

/**
 * return the buffer of colors
 */
function initColor(){
  var color = [ 0.0,0.0,1.0,1.0,
                0.0,1.0,0.0,1.0,
                1.0,0.0,0.0,1.0];

  var colorBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);

  return colorBuffer;
}

/**
 * return texture
 */
function initTexture(id){
  var imageData = document.getElementById(id);

  textureId = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textureId);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, imageData);

  return textureId;
}

/**
 * return the texture cordinate 
 */
function initTexCoord(){
  var texCoord = [0.0,1.0, 
                  1.0,1.0, 
                  0.5,0.0];

  var texCoordBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoord), gl.STATIC_DRAW);

  return texCoordBuffer;
}

/**
 * Initialize directly the gobal var (vertexBuffer, elementBuffer)
 */
function initSphere(){

  var nbSlice = 20;
  var nbStack = 20;

  vertexBuffer = new Array();
  elementBuffer = new Array();

  for (var i=0; i<=nbStrack; i++){
    for (var j=0; j<=nbSlice; j++) {
      
      // ----------------------------------------------------------
      // Math.PI
      // Voir M3DS pour la sphere
      // ----------------------------------------------------------


    };
  };


}

/**
 * update data for general loop (called by loop())
 */
function updateData(){

  angle += 0.01;

  modelview.setIdentity();
  modelview.translate(0,0,-4);
  modelview.rotateX(angle);

}

/**
 * draw the scene (called by loop())
 */
function drawScene(){
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  // enable shader + get vertex location 
  gl.useProgram(programShader);
  var vertexLocation = gl.getAttribLocation(programShader, 'vertex');
  var texCoordLocation = gl.getAttribLocation(programShader, 'texCoord');
  var textureLocation = gl.getUniformLocation(programShader, 'texture0');

  var modelviewLocation = gl.getUniformLocation(programShader, 'modelview');
  var projectionLocation = gl.getUniformLocation(programShader, 'projection');

  // set up uniform
  gl.uniform1i(textureLocation, 0);
  gl.uniformMatrix4fv(modelviewLocation, gl.FALSE, modelview.fv);
  gl.uniformMatrix4fv(projectionLocation, gl.FALSE, projection.fv);

  // draw geometry
  gl.enableVertexAttribArray(vertexLocation);
  gl.enableVertexAttribArray(texCoordLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(vertexLocation, 3, gl.FLOAT, gl.FALSE, 0, 0);


  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, gl.FALSE, 0, 0);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // disable all
  gl.disableVertexAttribArray(vertexLocation);
  gl.disableVertexAttribArray(texCoordLocation);
  gl.useProgram(null);
}

/**
 * main loop: draw, capture event, update scene, and loop again
 */
function loop(){
  drawScene();
  updateData();
  window.requestAnimationFrame(loop);
}


/**
 * Inisialize vertices, color, texture coord, texture and matrix
 */
function initData(){

  vertexBuffer = initVertex();
  //colorBuffer = initColor();
  texCoordBuffer = initTexCoord();
  texture = initTexture("earth");

  modelview = new Mat4();
  projection = new Mat4();

  projection.setFrustum(-0.1,0.1,-0.1,0.1,0.1,1000);

  angle = 0.0;

}


/** *******************************************
 * MAIN
 */
function main(){
  initGL();
  programShader = createProgram("video360");
  initData();
  loop();
}