import * as THREE from 'three'
import './app.styl'


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
camera.position.set( 0, 0, 5 );


let uniforms = { 
    u_resolution: { value: {x: window.innerHeight, y: window.innerHeight }},
    u_mouse: { value: {x: 0, y: 0 }}
}



const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: fragmentShader( )
});

window.addEventListener('mousemove', (e) =>{
    e.preventDefault()
    uniforms.u_mouse.value.x = e.clientX
    uniforms.u_mouse.value.y = e.clientY
})
 
const geometry = new THREE.PlaneBufferGeometry();
const mesh = new THREE.Mesh( geometry, shaderMaterial );

mesh.scale.set(window.innerHeight * 2, window.innerHeight, 1);

scene.add( mesh );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xfefefe );
document.body.appendChild( renderer.domElement );

animate();

function animate() {

    requestAnimationFrame( animate );   
    renderer.render( scene, camera );

}


function fragmentShader( ) {
    return `
    #ifdef GL_ES
    precision mediump float;
    #endif
    
    
    uniform vec2 u_resolution; 
    uniform vec2 u_mouse;
    
    float circleShape(float radius, vec2 position) {
    
      float value = distance(position, u_mouse / u_resolution);
     
      return step(radius, value);
    }
    
    void main() {
    
      vec2 pixelCoord = gl_FragCoord.xy / u_resolution;
      float circleWidth = 0.2;
      float circle = circleShape(circleWidth, pixelCoord);
      vec3 color = vec3(circle);
      gl_FragColor = vec4(color, 1.0);
    }
    `;
}