// inspired by 
// https://threejs.org/examples/?q=Water#webgl_gpgpu_water
// https://threejs.org/examples/#webgl_materials_envmaps
// https://threejs.org/docs/scenes/material-browser.html#MeshPhongMaterial

import * as THREE from 'three';
import Stats from 'stats';
import { GUI } from 'gui';
import { GPUComputationRenderer } from 'gpucompute';
import { OrbitControls } from "orbit";

// Texture width for simulation
const WIDTH = 128;

// Water size in system units
const BOUNDS = 512;
const BOUNDS_HALF = BOUNDS * 0.5;

let container, stats;
let camera, scene, renderer, controls;
let mouseMoved = false;
const mouseCoords = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

let waterMesh;
let meshRay;
let gpuCompute;
let heightmapVariable;
let waterUniforms;
const waterNormal = new THREE.Vector3();

const NUM_SPHERES = 5;
const spheres = [];
let spheresEnabled = true;

//addition for rain effect
let dropSize;
let dropFreq; // how long msec between drop
const dropCoords = new THREE.Vector2();
let dropped = false;

init();

function init() {
  
  dropSize = 1;
  dropFreq = 50;

  container = document.querySelector(".backboard");

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
  camera.position.set( 0, 200, 0 );
  camera.lookAt( 0, 0, 0 );

  scene = new THREE.Scene();

  const sun = new THREE.DirectionalLight( 0xFFFFFF, 20.0 );
  sun.position.set( 200, 300, 175 );
  sun.target.position.set(0,0,0);
  scene.add( sun );

  const sun2 = new THREE.DirectionalLight( 0x40A040, 4.0 );
  sun2.position.set( - 100, 350, - 200 );
  scene.add( sun2 );

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  container.appendChild( renderer.domElement );

  stats = new Stats();
  container.appendChild( stats.dom );

  container.style.touchAction = 'none';
  container.addEventListener( 'pointermove', onPointerMove );

  document.addEventListener( 'keydown', function ( event ) {

    // W Pressed: Toggle wireframe
    if ( event.keyCode === 87 ) {
      waterMesh.material.wireframe = ! waterMesh.material.wireframe;
      waterMesh.material.needsUpdate = true;
    }
  });

  window.addEventListener( 'resize', onWindowResize );
  const gui = new GUI();
  const effectController = {
    dropSize: 20.0,
    viscosity: 0.98,
    dropFrequency:dropFreq,
  };

  const valuesChanger = function () {
    heightmapVariable.material.uniforms[ 'dropSize' ].value = effectController.dropSize;
    heightmapVariable.material.uniforms[ 'viscosityConstant' ].value = effectController.viscosity;
    dropFreq = effectController.dropFrequency;
  };

  gui.add( effectController, 'dropSize', 1.0, 100.0, 1.0 ).onChange( valuesChanger );
  gui.add( effectController, 'viscosity', 0.9, 0.999, 0.001 ).onChange( valuesChanger );
  gui.add( effectController, 'dropFrequency', 5, 100, 1.0 ).onChange( valuesChanger );

  loadTexture()
  .then(envTexture => {
    initWater(envTexture);
    
    setTimeout(calcDropPoint, dropFreq);
    valuesChanger();  
    renderer.setAnimationLoop( animate );
  });
}

function calcDropPoint(){
  dropCoords.set( Math.floor(Math.random() * BOUNDS * 2 - BOUNDS), - (Math.floor(Math.random() * BOUNDS * 2 - BOUNDS)));
  dropped = true;  
  setTimeout(calcDropPoint, dropFreq);
}

async function loadTexture(){
  return new Promise(function (resolve,reject) {
    
    const r = "https://raw.githubusercontent.com/keiyashi/codepen-example/refs/heads/main/pic-37-invert_R.jpg";
    const urls = [r, r, r, r, r, r];
    
    //const r = "https://threejs.org/examples/textures/cube/Bridge2/";
    //const urls = [r + "posx.jpg", r + "negx.jpg", r + "posy.jpg", r + "negy.jpg", r + "posz.jpg", r + "negz.jpg"];
    
    // const r = "https://raw.githubusercontent.com/keiyashi/codepen-example/refs/heads/main/Brussels_";
    // const urls = [r + "px.jpg", r + "nx.jpg", r + "py.jpg", r + "ny.jpg", r + "pz.jpg", r + "nz.jpg"];

    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const reflectionCube = cubeTextureLoader.load( urls );
    resolve( reflectionCube );
  })
}

function initWater(envTexture) {

  const materialColor = 0x000000;
  const geometry = new THREE.PlaneGeometry( BOUNDS, BOUNDS, WIDTH - 1, WIDTH - 1 );

  // material: make a THREE.ShaderMaterial clone of THREE.MeshPhongMaterial, with customized vertex shader
  const material = new THREE.ShaderMaterial( {
    uniforms: THREE.UniformsUtils.merge( [
      THREE.ShaderLib.phong.uniforms,
      {
        'heightmap': { value: null }
      }
    ] ),
    vertexShader: document.getElementById( 'waterVertexShader' ).textContent,
    fragmentShader: THREE.ShaderChunk[ 'meshphong_frag' ],
  } );

  material.lights = true;
  material.envMap = envTexture;
  material.combine = THREE.AddOperation;
  material.reflectivity = 0.6 ;
  
  // Material attributes from THREE.MeshPhongMaterial
  // Sets the uniforms with the material values
  material.uniforms[ 'diffuse' ].value = new THREE.Color( materialColor );
  material.uniforms[ 'emissive' ].value = new THREE.Color( 0x444444 );
  material.uniforms[ 'specular' ].value = new THREE.Color( 0x111111 );
  material.uniforms[ 'shininess' ].value = Math.max( 50, 1e-4 );
  material.uniforms[ 'opacity' ].value = material.opacity;
  material.uniforms[ 'envMap' ].value = envTexture;

  // Defines
  material.defines.WIDTH = WIDTH.toFixed( 1 );
  material.defines.BOUNDS = BOUNDS.toFixed( 1 );

  waterUniforms = material.uniforms;

  waterMesh = new THREE.Mesh( geometry, material );
  waterMesh.rotation.x = - Math.PI / 2;
  waterMesh.matrixAutoUpdate = false;
  waterMesh.updateMatrix();
  scene.add( waterMesh );

  // THREE.Mesh just for mouse raycasting
  const geometryRay = new THREE.PlaneGeometry( BOUNDS, BOUNDS, 1, 1 );
  meshRay = new THREE.Mesh( geometryRay, new THREE.MeshBasicMaterial( { color: 0xFFFFFF, visible: false } ) );
  meshRay.rotation.x = - Math.PI / 2;
  meshRay.matrixAutoUpdate = false;
  meshRay.updateMatrix();
  scene.add( meshRay );

  // Creates the gpu computation class and sets it up
  gpuCompute = new GPUComputationRenderer( WIDTH, WIDTH, renderer );
  const heightmap0 = gpuCompute.createTexture();//initial heigth map
  heightmapVariable = gpuCompute.addVariable( 'heightmap', document.getElementById( 'heightmapFragmentShader' ).textContent, heightmap0 );

  gpuCompute.setVariableDependencies( heightmapVariable, [ heightmapVariable ] );
  heightmapVariable.material.uniforms[ 'mousePos' ] = { value: new THREE.Vector2( 10000, 10000 ) };
  heightmapVariable.material.uniforms[ 'dropSize' ] = { value: 20.0 };
  heightmapVariable.material.uniforms[ 'viscosityConstant' ] = { value: 0.98 };
  heightmapVariable.material.uniforms[ 'heightCompensation' ] = { value: 0 };
  heightmapVariable.material.defines.BOUNDS = BOUNDS.toFixed( 1 );

  const error = gpuCompute.init();
  if ( error !== null ) {
    console.error( error );
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function setMouseCoords( x, y ) {
  mouseCoords.set( ( x / renderer.domElement.clientWidth ) * 2 - 1, - ( y / renderer.domElement.clientHeight ) * 2 + 1 );
  mouseMoved = true;
}

function onPointerMove( event ) {
  if ( event.isPrimary === false ) return;

  setMouseCoords( event.clientX, event.clientY );
}

function animate() {
  
  controls.update();
  render();
  stats.update();
}

function render() {

  // Set uniforms: mouse interaction
  const uniforms = heightmapVariable.material.uniforms;
  if ( mouseMoved ) {
    raycaster.setFromCamera( mouseCoords, camera );
    const intersects = raycaster.intersectObject( meshRay );

    if ( intersects.length > 0 ) {
      const point = intersects[ 0 ].point;
      uniforms[ 'mousePos' ].value.set( point.x, point.z );
    } else {
      uniforms[ 'mousePos' ].value.set( 10000, 10000 );
    }
    mouseMoved = false;
  } else {
    uniforms[ 'mousePos' ].value.set( 10000, 10000 );
  }
  
  if( dropped ){
    uniforms[ 'mousePos' ].value.set( dropCoords.x, dropCoords.y );
    dropped = false;
  }

  // Do the gpu computation
  gpuCompute.compute();

  // Get compute output in custom uniform
  waterUniforms[ 'heightmap' ].value = gpuCompute.getCurrentRenderTarget( heightmapVariable ).texture;

  // Render
  renderer.render( scene, camera );
}