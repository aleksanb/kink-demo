DEBUG = false;
ORIGO = new THREE.Vector3(0, 0, 0);

TEXTS = [
    {
        title: "KINK",
        size: 100,
        position: {
            x: -1100,
            y: 500,
            z: -100
        },
        visibleToggle: [
            45000,
            53820,
            53900,
            53920,
            53960,
            54030,
            54060,
            54400

        ],
        initAsHidden: true
    },
    {
        title: "IS NOT KINECT",
        size: 100,
        position: {
            x: -800,
            y: 300,
            z: -100
        },
        visibleToggle: [
            45000,

        ],
        initAsHidden: true
    },
    {
        title: "KIDS",
        size: 100,
        position: {
            x: -1100,
            y: 500,
            z: -100
        },
        visibleToggle: [
            53820,
            53900,
            53920,
            53960,
            54030,
            54060,
            54400
        ],
        initAsHidden: true
    },
    {
        title: "HELP, I'M TRAPPED",
        size: 100,
        position: {
            x: 850,
            y: 850,
            z: -400
        },
        rotation: Math.PI/2,
        visibleToggle: [
            27000
        ],
    },
    {
        title: "IN A .JS LIBRARY!",
        size: 100,
        position: {
            x: 850,
            y: 700,
            z: -400
        },
        rotation: Math.PI/2,
        visibleToggle: [
            27000
        ],
    },
    {
        title: "BEKK",
        size: 100,
        position: {
            x: 3000,
            y: 375,
            z: 390
        },
        rotation: Math.PI/2,
        visibleToggle: [
            25500
        ],
    },
    {
        title: "BEKKENLOSNING",
        size: 100,
        position: {
            x: 3000,
            y: 375,
            z: 390
        },
        rotation: Math.PI/2,
        initAsHidden: true,
        visibleToggle: [
            25500,
            45000
        ],       
    },
    {
        title: "CLOUD",
        size: 100,
        position: {
            x: -1600,
            y: 780,
            z: 900
        },
        rotation: -Math.PI/2,
        /*
        initAsHidden: true,
        visibleToggle: [
            25500,
        ],     */
    },
    {
        title: "ROBOCUP",
        size: 100,
        position: {
            x: 3000,
            y: 500,
            z: -600
        },
        rotation: -Math.PI/2,
        initAsHidden: true,
        visibleToggle: [
            45000
        ],       
    }
];

var active_camera_index = 0;
var active_camera;
var camera_timestamps;
var camera, scene, side, x_spacing, z_spacing, cameratarget;
var osd, bg, snake, snakeTracker, terrain;
var materials, light, cameraskip, OSD, fadeStartTime, fadeGoalTime, fadeStart, fadeGoal, fadeFn;
var currentSnakeMove, currentSnakeMoveInitTime;
var skybox;
var axis;

var SNAKE_TRACK = [
    {
        from: {x:-3200, z:-3000},
        to: {x:-3200, z:0},
        duration: 10000,
        startTime: 0
    },
    {
        from: {x:-3200, z:0},
        to: {x: 3200, z:0},
        duration: 20000,
        startTime: 10000
    },
    {
        from: {x:3200, z:0},
        to: {x: 3200, z:1000},
        duration: 3000,
        startTime: 30000
    },
    {
        from: {x:3200, z:1000},
        to: {x: 500, z:1000},
        duration: 15000,
        startTime: 33000,
    },
    {
        from: {x:-3000, z:0},
        to: {x: -1000, z:0},
        duration: 6000,
        startTime: 48000,
    },
    {
        from: {x:-1000, z:0},
        to: {x: 1000, z:0},
        duration: 9000,
        startTime: 54000,
    }

];

var CAMERA_POSITIONS = {
    0: new FixedCamera({
        "position": {
            "x": -1500,
            "y": 1000,
            "z": -1500
        },
        "animate": true,
        "duration": 6000,
        "startposition": {
            "x": -3000,
            "y": 500,
            "z": -3000
        },
        "fadeIn": true,
        "fadeOut": true
    }),
    6000: new FixedCamera({
        "position": {
            "x": -2000,
            "y": 1050,
            "z": -1500
        },
        "startposition": {
            "x": -2000,
            "y": 2500,
            "z": -1500
        },
        "animate": true,
        "duration": 3000,
        "fadeIn": true
    }),
    9000: new FixedCamera({
        "position": {
            "x": -3300,
            "y": 600,
            "z": 400
        },
        "startposition": {
            "x": -2000,
            "y": 1050,
            "z": -1500
        },
        "animate": true,
        "duration": 3000,
        "fadeOut": true
    }),
    12000: new TrackingCamera({
        "position": {
            "x": -200,
            "y": 230,
            "z": 250
        },
        "startposition": {
            "x": 80,
            "y": 80,
            "z": 80
        },
        "animate": true,
        "duration": 8000
    }),
    18000: new FixedCamera({
        "position": {
            "x": 3400,
            "y": 800,
            "z": 350
        },
        "startposition": {
            "x": 3600,
            "y": 250,
            "z": 250
        },
        "animate": true,
        "duration": 6000
    }),
    24000: new FixedCamera({
        "position": {
            "x": 1000,
            "y": 800,
            "z": 350
        },
        "startposition": {
            "x": 3400,
            "y": 800,
            "z": 350
        },
        "animate": true,
        "duration": 8000
    }),
    36000: new FixedCamera({
        "position": {
            "x": 2400,
            "y": 800,
            "z": 600
        },
        "startposition": {
            "x": 3400,
            "y": 400,
            "z": 350
        },
        "animate": true,
        "duration": 3000
    }),
    39000: new FixedCamera({
        "position": {
            "x": -2000,
            "y": 820,
            "z": 1200
        },
        "startposition": {
            "x": 2400,
            "y": 800,
            "z": 600
        },
        "animate": true,
        "duration": 6000
    }),
    48000: new TrackingCamera({
        "position": {
            "x": -250,
            "y": 250,
            "z": 600
        },
        "startposition": {
            "x": 250,
            "y": 250,
            "z": 600
        },
        "animate": true,
        "duration": 6000
    }),
    54000: new TrackingCamera({
        "position": {
            "x": -250,
            "y": 1000,
            "z": 600
        },
        "startposition": {
            "x": -250,
            "y": 250,
            "z": 600
        },
        "animate": true,
        "duration": 3000
    }),
    57000: new FixedCamera({
        "position": {
            "x": -250,
            "y": 500,
            "z": 600
        },
        "startposition": {
            "x": -1000,
            "y": 800,
            "z": -200
        },
        "animate": true,
        "duration": 6000
    }),
    63000: new FixedCamera({
        "position": {
            "x": 2000,
            "y": 500,
            "z": -600
        },
        "startposition": {
            "x": -250,
            "y": 500,
            "z": 600
        },
        "animate": true,
        "duration": 12000
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
            cubes[(side-x-1)*side+y].mesh.material = materials[+on]; // materials no longer uses indexes
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
    "use strict";

    if (t >= camera_timestamps[active_camera_index+1]) {
        active_camera_index++;
        active_camera = CAMERA_POSITIONS[ camera_timestamps[active_camera_index] ];
        active_camera.init( camera );
    }

    bg.update();
    
    for ( var i=0; i < SNAKE_TRACK.length; i++ ) {
        if ( SNAKE_TRACK[i].startTime < t &&
            SNAKE_TRACK[i].startTime + SNAKE_TRACK[i].duration > t ) {
            if (SNAKE_TRACK[i] != currentSnakeMove) {
                currentSnakeMove = SNAKE_TRACK[i];
                currentSnakeMoveInitTime = t;
                break;
            }
        }
    }
    var currentSnakeMoveTime = t - currentSnakeMoveInitTime;
    var current_x = currentSnakeMove.from.x + 
        (currentSnakeMove.to.x - currentSnakeMove.from.x) / 
        currentSnakeMove.duration * currentSnakeMoveTime;
    var current_z = currentSnakeMove.from.z + 
        (currentSnakeMove.to.z - currentSnakeMove.from.z) / 
        currentSnakeMove.duration * currentSnakeMoveTime;

    var newY = terrain.getYValue(current_x, current_z) + 25;

    var newGoal = new THREE.Vector3( current_x, newY, current_z );
    snake.update( newGoal );

    axis.position = newGoal;
    axis.position.y += 50;

    var prevTarget = cameratarget.clone();
    var newTarget = snake.getPosition(); 
    if (newTarget.y-prevTarget.y > .0001) { newTarget.y = prevTarget.y + .0001; }
    if (prevTarget.y-newTarget.y > .0001) { newTarget.y = prevTarget.y - .0001; }

    cameratarget = newTarget;

    for ( var i=0; i < TEXTS.length; i++ ) {
        var text = TEXTS[i];
        if (text.visibleToggle && text.visibleToggle.length > 0) {
            if ( t > text.visibleToggle[0] ) {
                text.visibleToggle.shift();
                text.object.visible = !text.object.visible;
            }
        }
    }

    camera.position = active_camera.getPosition( cameratarget );

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

    bg.render();
    snake.render();
    
    camera.lookAt(cameratarget);
    renderer.render(scene, camera);
    
}

function init() {
    "use strict";

    setLoadingBar(.5, function() {

    camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);
    camera_timestamps = Object.keys(CAMERA_POSITIONS).sort(function(a,b){return a-b});
    active_camera = CAMERA_POSITIONS[ camera_timestamps[active_camera_index] ];
    camera.position = active_camera.init( camera );

    scene = new THREE.Scene();
    
    scene.add(camera);
    side = 32;

    x_spacing = 5 + 2.545 + 0.5;
    z_spacing = 4.363 * 2 + 0.5;
    
    osd = new OSD();
    bg = new BG();
    

    scene.fog = new THREE.Fog( 0x393939, 1, 3000 );

    materials = {
    "textTexture" : new THREE.MeshLambertMaterial({
        color : 0xE8B86F, blending : THREE.AdditiveBlending, transparent:false }),
    "snakeTexture" : new THREE.MeshLambertMaterial({ 
        map: THREE.ImageUtils.loadTexture("snake_texture.jpg") })
    };

    setLoadingBar(.8, function(){

    light = new THREE.SpotLight( 0xffffff );
    light.intensity = 0.9;
    light.position.set(100,1000,100);
    scene.add(light);

    var pointLight = new THREE.PointLight( 0x3366ff, 1.5 );
    pointLight.position.set( 0, 2000, 0 );
    scene.add( pointLight );

    var global_light = new THREE.AmbientLight( 0xa0a0a0 ); // soft white light
    scene.add( global_light );

    skybox = createSkybox("images/");
    scene.add(skybox);

    axis = new THREE.AxisHelper( 200 );
    axis.position.setY(600);
    scene.add(axis);
    
    for ( var i=0; i < TEXTS.length; i++ ) {
        var text = TEXTS[i];
        var text3d = new THREE.TextGeometry( text.title, {
            size: text.size,
            height: 5,
            curveSegments: 4,
            font: "helvetiker",
            weight: "bold",
            style: "normal",
            bevelEnabled: true,
            bevelThickness: 5,
            bevelSize: 1
        });
        var textMesh = new THREE.Mesh( text3d, materials.textTexture );
        text.object = textMesh;
        textMesh.position = text.position;
        textMesh.rotation.y = text.rotation || 0;
        scene.add(textMesh);
        if (text.initAsHidden) {
            textMesh.visible = false;
        }
    }

    cameraskip = false;

    bg.init();

    terrain = new Terrain(256, 256);
    scene.add(terrain.mesh);

    currentSnakeMove = SNAKE_TRACK[0];
    currentSnakeMoveInitTime = t;
    var newY = terrain.getYValue(currentSnakeMove.from.x, currentSnakeMove.from.z) + 25;

    snake = new Snake( scene, materials.snakeTexture, new THREE.Vector3( currentSnakeMove.from.x, 700, currentSnakeMove.from.z, 50 ), 50 );
    var front_snake = snake;

    for (var i = 0; i < 30; i++ ) {
        var newPosition = new THREE.Vector3( front_snake.getPosition().x, newY, front_snake.getPosition().z - 10);
        var to_be_attached = new Snake(scene, materials.snakeTexture, newPosition, 40 - 5 * Math.sin(i/2) );
        front_snake.setPrevious(to_be_attached);
        front_snake = to_be_attached;
    }
    
    cameratarget = snake.getPosition();

    setLoadingBar(1, function(){});

    fadeStartTime = 0;
    fadeGoalTime = 0;
    fadeStart = 0;
    fadeGoal = 0;
    fadeFn = undefined;
    fadeIn(2000);
    })});
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

function createSkybox(url){
    var cubeMaterial = new THREE.MeshLambertMaterial({ 
        map: THREE.ImageUtils.loadTexture("images/skybox.png"),
        side: THREE.DoubleSide });

    var skybox = new THREE.Mesh( new THREE.CubeGeometry(7500, 7500, 7500, 1, 1, 1), cubeMaterial);
    return skybox;
}
