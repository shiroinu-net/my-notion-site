"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GPUComputationRenderer } from "three-stdlib";

export default function WaterBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Configuration ---
    const WIDTH = 256; // Texture width for simulation
    const BOUNDS = 1024;
    // const BOUNDS_HALF = BOUNDS * 0.5;

    let dropSize = 20.0;
    let dropFreq = 50; // ms
    let viscosity = 0.98;

    let container: HTMLDivElement;
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;
    
    let mouseMoved = false;
    const mouseCoords = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    let waterMesh: THREE.Mesh;
    let meshRay: THREE.Mesh;
    let gpuCompute: GPUComputationRenderer;
    let heightmapVariable: any;
    let waterUniforms: any;

    const dropCoords = new THREE.Vector2();
    let dropped = false;
    
    let animationId: number;
    let timeoutId: NodeJS.Timeout;

    // --- Shaders ---
    const heightmapFragmentShader = `
      #include <common>

      uniform vec2 mousePos;
      uniform float dropSize;
      uniform float viscosityConstant;
      uniform float heightCompensation;

      void main()	{

        vec2 cellSize = 1.0 / resolution.xy;

        vec2 uv = gl_FragCoord.xy * cellSize;

        // heightmapValue.x == height from previous frame
        // heightmapValue.y == height from penultimate frame
        // heightmapValue.z, heightmapValue.w not used
        vec4 heightmapValue = texture2D( heightmap, uv );

        // Get neighbours
        vec4 north = texture2D( heightmap, uv + vec2( 0.0, cellSize.y ) );
        vec4 south = texture2D( heightmap, uv + vec2( 0.0, - cellSize.y ) );
        vec4 east = texture2D( heightmap, uv + vec2( cellSize.x, 0.0 ) );
        vec4 west = texture2D( heightmap, uv + vec2( - cellSize.x, 0.0 ) );

        // https://web.archive.org/web/20080618181901/http://freespace.virgin.net/hugo.elias/graphics/x_water.htm

        float newHeight = ( ( north.x + south.x + east.x + west.x ) * 0.5 - heightmapValue.y ) * viscosityConstant;

        // Mouse influence
        float mousePhase = clamp( length( ( uv - vec2( 0.5 ) ) * BOUNDS - vec2( mousePos.x, - mousePos.y ) ) * PI / dropSize, 0.0, PI );
        newHeight += ( cos( mousePhase ) + 1.0 ) * 0.28;

        heightmapValue.y = heightmapValue.x;
        heightmapValue.x = newHeight;

        gl_FragColor = heightmapValue;
      }
    `;

    const waterVertexShader = `
      uniform sampler2D heightmap;

      #define PHONG

      varying vec3 vViewPosition;

      #ifndef FLAT_SHADED

        varying vec3 vNormal;

      #endif

      #include <common>
      #include <uv_pars_vertex>
      #include <displacementmap_pars_vertex>
      #include <envmap_pars_vertex>
      #include <color_pars_vertex>
      #include <morphtarget_pars_vertex>
      #include <skinning_pars_vertex>
      #include <shadowmap_pars_vertex>
      #include <logdepthbuf_pars_vertex>
      #include <clipping_planes_pars_vertex>

      void main() {

        vec2 cellSize = vec2( 1.0 / WIDTH, 1.0 / WIDTH );

        #include <uv_vertex>
        #include <color_vertex>

        // # include <beginnormal_vertex>
        // Compute normal from heightmap
        vec3 objectNormal = vec3(
          ( texture2D( heightmap, uv + vec2( - cellSize.x, 0 ) ).x - texture2D( heightmap, uv + vec2( cellSize.x, 0 ) ).x ) * WIDTH / BOUNDS,
          ( texture2D( heightmap, uv + vec2( 0, - cellSize.y ) ).x - texture2D( heightmap, uv + vec2( 0, cellSize.y ) ).x ) * WIDTH / BOUNDS,
          1.0 );
        //<beginnormal_vertex>

        #include <morphnormal_vertex>
        #include <skinbase_vertex>
        #include <skinnormal_vertex>
        #include <defaultnormal_vertex>

      #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED

        vNormal = normalize( transformedNormal );

      #endif

        //# include <begin_vertex>
        float heightValue = texture2D( heightmap, uv ).x;
        vec3 transformed = vec3( position.x, position.y, heightValue );
        //<begin_vertex>

        #include <morphtarget_vertex>
        #include <skinning_vertex>
        #include <displacementmap_vertex>
        #include <project_vertex>
        #include <logdepthbuf_vertex>
        #include <clipping_planes_vertex>

        vViewPosition = - mvPosition.xyz;

        #include <worldpos_vertex>
        // #include <envmap_vertex> 
        #include <shadowmap_vertex>
      }
    `;

    // --- Initialization ---
    init();

    function init() {
      container = containerRef.current!;

      camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
      camera.position.set( 0, 200, 0 );
      camera.lookAt( 0, 0, 0 );

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xE8E8E3); // Matches --bg-pale-gray

      const sun = new THREE.DirectionalLight( 0xFFFFFF, 3.0 ); 
      sun.position.set( 200, 300, 175 );
      scene.add( sun );

      const sun2 = new THREE.DirectionalLight( 0x40A040, 2.0 );
      sun2.position.set( - 100, 350, - 200 );
      scene.add( sun2 );
      
      const ambientLight = new THREE.AmbientLight(0x404040, 2.0); // Soft white light
      scene.add(ambientLight);

      renderer = new THREE.WebGLRenderer({ alpha: true }); 
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      container.appendChild( renderer.domElement );

      window.addEventListener( 'pointermove', onPointerMove );
      window.addEventListener( 'pointerdown', onPointerMove ); // Add support for taps/clicks
      window.addEventListener( 'resize', onWindowResize );

      // No texture loading needed
      initWater();
      calcDropPoint();
      animate();
    }

    function calcDropPoint(){
        // Raindrops
        dropCoords.set( 
            Math.floor(Math.random() * BOUNDS * 2 - BOUNDS), 
            - (Math.floor(Math.random() * BOUNDS * 2 - BOUNDS))
        );
        dropped = true;  
        timeoutId = setTimeout(calcDropPoint, dropFreq);
    }

    function initWater() {
      const materialColor = 0xE8E8E3; // Matches --bg-pale-gray

      const geometry = new THREE.PlaneGeometry( BOUNDS, BOUNDS, WIDTH - 1, WIDTH - 1 );

      // material: make a THREE.ShaderMaterial clone of THREE.MeshPhongMaterial, with customized vertex shader
      const material = new THREE.ShaderMaterial( {
        uniforms: THREE.UniformsUtils.merge( [
          THREE.ShaderLib.phong.uniforms,
          {
            'heightmap': { value: null }
          }
        ] ),
        vertexShader: waterVertexShader,
        fragmentShader: THREE.ShaderChunk[ 'meshphong_frag' ],
      } );

      material.lights = true;
      // material.envMap = envTexture; // Removed
      // @ts-ignore
      // material.combine = THREE.AddOperation; 
      // @ts-ignore
      // material.reflectivity = 0.6 ;
      
      material.uniforms[ 'diffuse' ].value = new THREE.Color( materialColor );
      material.uniforms[ 'emissive' ].value = new THREE.Color( 0x004477 ); // Deep blue emissive
      material.uniforms[ 'specular' ].value = new THREE.Color( 0xFFFFFF ); // White specular highlights
      material.uniforms[ 'shininess' ].value = Math.max( 100, 1e-4 ); // Higher shininess for wet look
      material.uniforms[ 'opacity' ].value = material.opacity;
      // material.uniforms[ 'envMap' ].value = envTexture; // Removed

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

      // GPU Computation
      gpuCompute = new GPUComputationRenderer( WIDTH, WIDTH, renderer );
      
      if (renderer.capabilities.isWebGL2 === false ) {
        gpuCompute.setDataType( THREE.HalfFloatType );
      }

      const heightmap0 = gpuCompute.createTexture();
      heightmapVariable = gpuCompute.addVariable( 'heightmap', heightmapFragmentShader, heightmap0 );

      gpuCompute.setVariableDependencies( heightmapVariable, [ heightmapVariable ] );
      heightmapVariable.material.uniforms[ 'mousePos' ] = { value: new THREE.Vector2( 10000, 10000 ) };
      heightmapVariable.material.uniforms[ 'dropSize' ] = { value: dropSize };
      heightmapVariable.material.uniforms[ 'viscosityConstant' ] = { value: viscosity };
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

    // Convert mouse to Three.js coordinates
    function setMouseCoords( x: number, y: number ) {
        mouseCoords.set( ( x / renderer.domElement.clientWidth ) * 2 - 1, - ( y / renderer.domElement.clientHeight ) * 2 + 1 );
        mouseMoved = true;
    }

    function onPointerMove( event: PointerEvent ) {
      if ( event.isPrimary === false ) return;
      setMouseCoords( event.clientX, event.clientY );
    }

    function animate() {
      animationId = requestAnimationFrame( animate );
      render();
    }

    function render() {
      if (!heightmapVariable) return; // Wait for init

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

    // Cleanup
    return () => {
        if (animationId) cancelAnimationFrame(animationId);
        if (timeoutId) clearTimeout(timeoutId);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerdown', onPointerMove);
        window.removeEventListener('resize', onWindowResize);
        if (container && renderer) {
            container.removeChild(renderer.domElement);
            renderer.dispose();
        }
        // Dispose geometries/materials if possible
    };

  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-50 pointer-events-none"
    />
  );
}
