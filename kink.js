DEBUG = false;
ORIGO = new THREE.Vector3(0, 0, 0);
cameraMovementDone = true;

TEXTS = [
    "KINK IS NOT KINECT"
];

note_midicallback = function(e){};

active_camera_index = 0;

CAMERA_POSITIONS = {
    0: {
       "position": {
           "x": -2000,
           "y": 1000,
           "z": 0
       },
       "animate": false,
    },
    3000: {
               "position": {
                   "x": 3000,
                   "y": 1000,
                   "z": 0
               },
               "animate": true,
               "duration": 5000
           },
    10000: {
               "position": {
                   "x": -2000,
                   "y": 3000,
                   "z": 2000
               },
               "animate": false
           },
    10001: {
               "position": {
                   "x": -2000,
                   "y": 1500,
                   "z": 2000
               },
               "animate": true,
               "duration": 3000
           }
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


function newCameraMovement(movementTime, posx, posy, posz, rotx, roty, rotz, tarx,tary,tarz) {
    cameraMovementDone = false;
    deepCopy3DObject(camera, startcamera);
    startcamera.time = t;
    
    goalcamera.position.x = posx;
    goalcamera.position.y = posy;
    goalcamera.position.z = posz;
    
    goalcamera.rotation.x = rotx;
    goalcamera.rotation.y = roty;
    goalcamera.rotation.z = rotz;
    
    cameratarget.x = tarx || 0;
    cameratarget.y = tary || 0;
    cameratarget.z = tarz || 0;
    
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

    /* interpolate camera movement */
    if(!cameraMovementDone){
        var interpolt = (t-startcamera.time)/(goalcamera.time-startcamera.time);
        if(interpolt >=0 && interpolt < 1){
            camera.position.x = smoothstep(startcamera.position.x, goalcamera.position.x, interpolt);
            camera.position.y = smoothstep(startcamera.position.y, goalcamera.position.y, interpolt);
            camera.position.z = smoothstep(startcamera.position.z, goalcamera.position.z, interpolt);
            
            camera.rotation.x = smoothstep(startcamera.rotation.x, goalcamera.rotation.x, interpolt);
            camera.rotation.y = smoothstep(startcamera.rotation.y, goalcamera.rotation.y, interpolt);
            camera.rotation.z = smoothstep(startcamera.rotation.z, goalcamera.rotation.z, interpolt);
        }else{
            deepCopy3DObject(goalcamera, camera);
            cameraMovementDone = true;
        }
    }
    
    /* set the position of the global ambient light */
    light.position.x = -camera.position.x;
    light.position.y = camera.position.y;
    light.position.z = -camera.position.z;

    var camera_timestamps = Object.keys(CAMERA_POSITIONS).sort(function(a,b){return a-b});
    if (t >= camera_timestamps[active_camera_index+1]) {
        active_camera_index++;
        console.log("Active camera index: %i", active_camera_index);
        var active_camera = CAMERA_POSITIONS[ camera_timestamps[active_camera_index] ];
        if (active_camera.animate) {
            var animation_time = active_camera.duration || 1000;
            newCameraMovement(
                    animation_time,
                    active_camera.position.x,
                    active_camera.position.y,
                    active_camera.position.z
                    );
        } else {
            camera.position = active_camera.position;
        }
    }

    bg.update();
    snake.update();

    cameratarget.x = snake.position.x;
    cameratarget.y = snake.position.y;
    cameratarget.z = snake.position.z;
    
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

    camera = new THREE.PerspectiveCamera(75, 16 / 9, 1, 10000);
    //camera.position.y = 200;
    camera.position.z = 1000;
    startcamera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 10000);
    startcamera.time = 0;
    goalcamera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 10000);
    goalcamera.time = 0;
    cameratarget = new THREE.Vector3(0,0,0);

    scene = new THREE.Scene();
    
    scene.add(camera);
    side = 32;

    x_spacing = 5 + 2.545 + 0.5;
    z_spacing = 4.363 * 2 + 0.5;
    
    osd = new OSD();
    bg = new BG();

    scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0005, 1000 );

    materials = [
    new THREE.MeshLambertMaterial({
        color : 0xE8B86F, blending : THREE.AdditiveBlending, transparent:true
    }), 
    new THREE.MeshLambertMaterial({
        color : 0xE8B86F, blending : THREE.AdditiveBlending, transparent:false})
    ];

    light = new THREE.SpotLight();
    light.intensity = 0.5;
    scene.add(light);
    
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
    camera.position.y = terrain.data[ 128 + 32768 ] + 500;


    setLoadingBar(1, function(){});

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
