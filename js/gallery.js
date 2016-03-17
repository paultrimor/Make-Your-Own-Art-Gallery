
/************ THEE JS ****************/

var main = function () {
  var clock;
  var scene, camera, renderer;
  var havePointerLock = checkForPointerLock();
  var controls, controlsEnabled;
  var moveForward, moveBackward, moveLeft, moveRight, canJump;
  var velocity = new THREE.Vector3();


  init();
  animate();

  function init() {
    initControls();
    initPointerLock();

    //footStepSfx.loop = true;

    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xb2e1f2, 0, 750);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.y = 10;

    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

  // floor
  scene.add(createFloor());

  //walls 
  scene.add(createWall(300, 100, 0, 0, 50, -150)); 
  scene.add(createWall(300, 100, Math.PI, 0, 50, 150)); 
  scene.add(createWall(300, 100, -Math.PI/2, 150, 50, 0));
  scene.add(createWall(300, 100, Math.PI/2, -150, 50, 0));
  //banner (width, height, x, y, z)

 	//Main gallery text (string, size, x, y, z) 
    //drawText(); 

    //Art Work! 
  for (var i = 0; i < 4; i++){
     scene.add(createArt(PICTURES[i], 45, 50, 0, -110 + (i * 75), 40, -149)); 
  }
  for (var i = 4; i < 8; i++){
     scene.add(createArt(PICTURES[i], 45, 50, Math.PI/2, 110 + ((4-i) * 75), 40, -149)); 
  }
  for (var i = 8; i < 12; i++){
     scene.add(createArt(PICTURES[i], 45, 50, Math.PI, 110 + ((8-i) * 75), 40, -149)); 
  }
  for (var i = 12; i < 16; i++){
     scene.add(createArt(PICTURES[i], 45, 50, -Math.PI/2, 110 + ((12-i) * 75), 40, -149)); 
  }


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xb2e1f2);
    document.body.appendChild(renderer.domElement);

    }

  function animate() {
    requestAnimationFrame(animate);
    updateControls();
    renderer.render(scene, camera);

  }

//Key Controls 
  function checkForPointerLock() {
    return 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
  }
  
  function initPointerLock() {
    var element = document.body;
    if (havePointerLock) {
      var pointerlockchange = function (event) {
        if (document.pointerLockElement === element || 
            document.mozPointerLockElement === element || 
            document.webkitPointerLockElement === element) {
          controlsEnabled = true;
          controls.enabled = true;
        } else {
          controls.enabled = false;
        }
      };

      var pointerlockerror = function (event) {
        element.innerHTML = 'PointerLock Error';
      };

      document.addEventListener('pointerlockchange', pointerlockchange, false);
      document.addEventListener('mozpointerlockchange', pointerlockchange, false);
      document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

      document.addEventListener('pointerlockerror', pointerlockerror, false);
      document.addEventListener('mozpointerlockerror', pointerlockerror, false);
      document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

      var requestPointerLock = function(event) {
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();
      };

      element.addEventListener('click', requestPointerLock, false);
    } else {
      element.innerHTML = 'Bad browser; No pointer lock';
    }
  }
  
  function onKeyDown(e) {
    switch (e.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = true;
        break;
      case 37: // left
      case 65: // a
        moveLeft = true; 
        break;
      case 40: // down
      case 83: // s
        moveBackward = true;
        break;
      case 39: // right
      case 68: // d
        moveRight = true;
        break;
      case 32: // space
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;
    }
  }

  function onKeyUp(e) {
    switch(e.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = false;
        break;
      case 37: // left
      case 65: // a
        moveLeft = false;
        break;
      case 40: // down
      case 83: // s
        moveBackward = false;
        break;
      case 39: // right
      case 68: // d
        moveRight = false;
        break;
    }
  }

  function initControls() {
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);
  }
  function updateControls() {
    if (controlsEnabled) {
      var delta = clock.getDelta();
      var walkingSpeed = 1000.0;

      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;

      if (moveForward) velocity.z -= walkingSpeed * delta;
      if (moveBackward) velocity.z += walkingSpeed * delta;

      if (moveLeft) velocity.x -= walkingSpeed * delta;
      if (moveRight) velocity.x += walkingSpeed * delta;

      controls.getObject().translateX(velocity.x * delta);
      controls.getObject().translateY(velocity.y * delta);
      controls.getObject().translateZ(velocity.z * delta);

      //Collision detection on the walls 
      if (controls.getObject().position.x > 150)
        controls.getObject().position.x = 145;
      if (controls.getObject().position.x < -150)
        controls.getObject().position.x = -145; 
      if (controls.getObject().position.z > 150)
        controls.getObject().position.z = 145; 
      if(controls.getObject().position.z < -150)
        controls.getObject().position.z = -145; 


     }     

  }



/*** Additional Functions **/

function createBanner(width, height, x, y, z) {
	var bannerGeometry = new THREE.PlaneGeometry(width, height);
		  bannerGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(x, y, z)); 
	var bannerMaterial = new THREE.MeshBasicMaterial( {color: 0xff0022});
	var bannerMesh = new THREE.Mesh( bannerGeometry, bannerMaterial);
	return bannerMesh;
}

function drawText(text, sizet, x, y, z) {
  
}

function createArt(url, width, height, radian, x, y, z){
  THREE.ImageUtils.crossOrigin = ''; 
  var imageTexture = THREE.ImageUtils.loadTexture(url); 
  var plane = new THREE.PlaneGeometry (width, height);  
  plane.applyMatrix(new THREE.Matrix4().makeTranslation(x, y, z)); 
  plane.applyMatrix(new THREE.Matrix4().makeRotationY(radian));
  var planeMaterial = new THREE.MeshBasicMaterial({ map: imageTexture}); 
  return new THREE.Mesh(plane, planeMaterial); 
}


function createFloor() {
    var geometry = new THREE.PlaneGeometry(300, 300, 1, 1);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI/2));
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
    var texture = THREE.ImageUtils.loadTexture('res/floor.png');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(30, 30);
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });
    return new THREE.Mesh(geometry, material);
}

function createWall(width, height, radian, x, y, z) {
  var wallGeometry = new THREE.PlaneGeometry(width, height, 10, 10); 
  wallGeometry.applyMatrix(new THREE.Matrix4().makeRotationY(radian)); 
  wallGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(x, y, z)); 
  var texture = THREE.ImageUtils.loadTexture("res/vaporwaveMountains.jpg"); 
  var wallMaterial = new THREE.MeshBasicMaterial({ color: 0x999933, map: texture }); 
  return new THREE.Mesh(wallGeometry, wallMaterial); 
}

}


//Variables used to grab Flickr Images 
const MAX_PICS = 20; 
var PICTURES = []; 
var link; 
var getParameterByName = function(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
var keyword = getParameterByName("searchInput", window.location.href); 



/*Pulls images from FlickrAPI and stores them into an array names pictures */
var getFlickrImages = function() {
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
      {
        tags: keyword, 
        tagmode: "any", 
        format: "json"
      }, function (data) {
        $.each(data.items, function(i, item) {
          PICTURES.push(item.media['m']); 
          if (i == MAX_PICS - 1) 
            return false; 
        })
      }).then(function(data){
        main(); 
      });
  }
getFlickrImages();
