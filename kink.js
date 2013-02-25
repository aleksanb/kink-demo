DEBUG = false;
ORIGO = new THREE.Vector3(0, 0, 0);

TEXTS = [
    "KINK IS NOT KINECT"
];

var active_camera_index = 0;
var active_camera;
var camera_timestamps;
var camera, scene, side, x_spacing, z_spacing, cameratarget;
var osd, bg, snake;
var materials, light, cameraskip, OSD, fadeStartTime, fadeGoalTime, fadeStart, fadeGoal, fadeFn;

var CAMERA_POSITIONS = {
    0: new FixedCamera({
        "position": {
            "x": -2000,
            "y": 1000,
            "z": 0
        },
        "animate": true,
        "duration": 3000,
        "startposition": {
            "x": 0,
            "y": 0,
            "z": 0
        }
    }),
    3000: new FixedCamera({
        "position": {
            "x": 700,
            "y": 1050,
            "z": 400
        },
        "startposition": {
            "x": 700,
            "y": 1800,
            "z": 400
        },
        "animate": true,
        "duration": 3000
    }),
    8000: new TrackingCamera({
        "position": {
            "x": -200,
            "y": 300,
            "z": 0
        },
        "startposition": {
            "x": 50,
            "y": 50,
            "z": 50
        },
        "animate": true,
        "duration": 6000
    })
};


/* smoothstep interpolaties between a and b, at time t from 0 to 1 */
function smoothstep(a, b, t) {
    var v = t * t * (3 - 2 * t);
    return b * v + a * (1 - v);
};

function lerp(a, b, t) {
    return b * t + a * (1 - t);
}

function drawImage(img,startx,starty) {
    var x = startx+1;
    var y = starty;
    var on = false;
    for(var i=0;i<img.data.length;i++){
        var num = img.data.charCodeAt(i)-65;
        while(num-->0) {
            if(on) cubes[(side-x-1)*side+y].mesh.position.y = 25+5*Math.sin(x/4+t/4000);
            cubes[(side-x-1)*side+y].mesh.material = materials[+on];
            x++;
            if(x>startx+img.w) {
                x = startx+1;
                y++;
            }
        }
        on = !on;
    }
}


function newCameraMovement(movementTime, posx, posy, posz) {
    cameraMovementDone = false;
    deepCopy3DObject(camera, startcamera);
    startcamera.time = t;
    
    goalcamera.position.x = posx;
    goalcamera.position.y = posy;
    goalcamera.position.z = posz;
    
    //var samples_per_quaver = midi.ticks_per_beat / midi.ticks_per_second * 44100;
    goalcamera.time = t+movementTime;
}

function deepCopy3DObject(from, to) {
    to.position.x = from.position.x;
    to.position.y = from.position.y;
    to.position.z = from.position.z;
    
    to.rotation.x = from.rotation.x;
    to.rotation.y = from.rotation.y;
    to.rotation.z = from.rotation.z;
}

function update() {

    if (t >= camera_timestamps[active_camera_index+1]) {
        active_camera_index++;
        console.log("Active camera index: %i", active_camera_index);
        active_camera = CAMERA_POSITIONS[ camera_timestamps[active_camera_index] ];
        active_camera.init( camera );
    }

    bg.update();
    snake.update();

    cameratarget.x = snake.position.x;
    cameratarget.y = snake.position.y;
    cameratarget.z = snake.position.z;
    
    camera.position = active_camera.getPosition( cameratarget );

    /* set the position of the global ambient light */
    /*
    light.position.x = -camera.position.x;
    light.position.y = camera.position.y;
    light.position.z = -camera.position.z;
    */
    light.position.x = camera.position.x;
    light.position.y = camera.position.y;
    light.position.z = camera.position.z;
    light.rotation.x = camera.rotation.x;
    light.rotation.y = camera.rotation.y;
    light.rotation.z = camera.rotation.z;
}

function render() {

    /* render the 2d canvas */
    tdx.clearRect(0,0,twoDCanvas.width, twoDCanvas.height);
    osd.render(); //yah, we just always render the osd
    
    if(t < fadeGoalTime){
        tdx.fillStyle = "rgba(0,0,0,"+lerp(fadeStart,fadeGoal, (t-fadeStartTime)/(fadeGoalTime-fadeStartTime))+")";
        tdx.fillRect(0,0,16*GU,9*GU);
    }else if(fadeGoalTime != 0){
        tdx.fillStyle = "rgba(0,0,0,"+fadeGoal+")";
        tdx.fillRect(0,0,16*GU,9*GU);
        fadeGoalTime = 0;
        if(fadeGoal = 1 && fadeFn){
            fadeFn();
        }
    }
    
    //SCENES[active_scene].render();

    bg.render();
    snake.render();
    
    camera.lookAt(cameratarget);
    renderer.render(scene, camera);
    
}

function Scene(update,render, onenter) {

    this.update = update;
    this.render = render;
    this.onenter = onenter;

}

function init() {
    "use strict";

    setLoadingBar(.7, function() {

    camera = new THREE.PerspectiveCamera(75, 16 / 9, 1, 10000);
    camera_timestamps = Object.keys(CAMERA_POSITIONS).sort(function(a,b){return a-b});
    active_camera = CAMERA_POSITIONS[ camera_timestamps[active_camera_index] ];
    camera.position = active_camera.init( camera );
    console.log("Init position: %o", camera.position);

    /*
    startcamera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 10000);
    startcamera.time = 0;
    goalcamera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 10000);
    goalcamera.time = 0;
    */

    scene = new THREE.Scene();
    
    scene.add(camera);
    side = 32;

    x_spacing = 5 + 2.545 + 0.5;
    z_spacing = 4.363 * 2 + 0.5;
    
    osd = new OSD();
    bg = new BG();
    

    //scene.fog = new THREE.Fog( 0x191919, .05, 3000 );

    materials = [
    new THREE.MeshLambertMaterial({
        color : 0xE8B86F, blending : THREE.AdditiveBlending, transparent:true
    }), 
    new THREE.MeshLambertMaterial({
        color : 0xE8B86F, blending : THREE.AdditiveBlending, transparent:false}),
    new THREE.MeshBasicMaterial({
        color : 0xFFFFFF })
    ];

    light = new THREE.SpotLight( 0xffffff );
    light.intensity = 0.9;
    light.position.set(100,1000,100);
    scene.add(light);

    var global_light = new THREE.AmbientLight( 0x505050 ); // soft white light
    scene.add( global_light );
    
    var text = "K I N K";
    var text3d = new THREE.TextGeometry( text, {
        size: 180,
        height: 5,
        curveSegments: 4,
        font: "helvetiker",
        weight: "bold",
        style: "normal",
        bevelEnabled: true,
        bevelThickness: 5,
        bevelSize: 1
    });
    var textMesh = new THREE.Mesh( text3d, materials[1] );
    scene.add(textMesh);
    console.log(textMesh);
    textMesh.position.set(100, 1000, -200);

    cameraskip = false;

    fadeStartTime = 0;
    fadeGoalTime = 0;
    fadeStart = 0;
    fadeGoal = 0;
    fadeFn = undefined;
    fadeIn(2000);

    bg.init();



    snake = new Snake(scene, materials[1]);
    cameratarget = new THREE.Vector3(
            snake.position.x,
            snake.position.y,
            snake.position.z
            );

    var terrain = new Terrain(256, 256);
    scene.add(terrain.mesh);


    setLoadingBar(1, function(){});

    });
}

function fadeIn(duration) {

    fadeStartTime = t;
    fadeGoalTime = t+duration;
    fadeStart = 1;
    fadeGoal = 0;

}

function fadeOut(duration,fn) {

    fadeStartTime = t;
    fadeGoalTime = t+duration;
    fadeStart = 0;
    fadeGoal = 1;
    fadeFn = fn;

}
