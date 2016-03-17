var mainFunction = function(){

var webGl; 
var canvas; 
var container; 
var containerWidth = 1000; 

container = document.createElement('div'); 
container.style.position = 'absolute';
container.style.top = '0%';
container.style.display = 'block';
container.style.width = 2000;
container.style.height = 10000; 

document.body.appendChild( container );

canvas = document.getElementById("webglCanvas");
document.body.appendChild(canvas); 


var clock = new THREE.Clock(); 

//Create Scene
var scene = new THREE.Scene(); 
var camera = new THREE.PerspectiveCamera(50, 2000/1000, 0.1, 1000); 


//Importing an object
var asabust, asabust2; 
var loader = new THREE.JSONLoader(); 
var bust = function(object) {
	asabust = new THREE.Mesh(
		object, new THREE.MeshLambertMaterial({color: '#FF34E4' })
		);
	asabust2 = new THREE.Mesh(
		object, new THREE.MeshLambertMaterial({color: '#C4C8FE' })
		);
	asabust.position.x = -2;
	scene.add(asabust);
	asabust2.position.x = 2;
	scene.add(asabust2);
}
loader.load("js/lady.json", bust); 

//Adding Light
var light = new THREE.PointLight('#C4C8FE', 2, 500); 
light.position.set(10, 10, 10); 
scene.add(light);
scene.add(new THREE.PointLightHelper(light, 3)); 

camera.position.z = 7;
camera.position.y = 2; 

//Rendering 
var renderer = new THREE.WebGLRenderer({alpha: true}); 
renderer.setClearColor(0x000000, 0);
renderer.setSize(2000, 1000); 
container.appendChild(renderer.domElement);


var render = function() {

	requestAnimationFrame(render); 
	renderer.render(scene, camera);
    animate(); 
}

var detectInput = function() {

	$("body").on('mousemove', function(e) {
		console.log(e.pageX, e.pageY);
			console.log(inputRect.top, inputRect.right, inputRect.bottom, inputRect.left);

	});
}

var velocity = 0.01;  
var animate = function() {
    var time = clock.getElapsedTime(); 
    asabust.rotation.y += velocity;
    asabust2.rotation.y -= velocity;

}

detectInput(); 
render();
animate(); 


}

