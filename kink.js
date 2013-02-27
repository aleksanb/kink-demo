var active_camera_index = 0;
var active_camera;
var camera_timestamps;
var camera, scene, side, x_spacing, z_spacing, cameratarget;
var bg, snake, terrain;
var apple, apples, currentApple, numberOfApples;
var materials, light, cameraskip, fadeStartTime, fadeGoalTime, fadeStart, fadeGoal, fadeFn;
var currentSnakeMove, currentSnakeMoveInitTime;
var skybox, lightCarpets = [];
var axis;

/* smoothstep interpolaties between a and b, at time t from 0 to 1 */
function smoothstep(a, b, t) {
    var v = t * t * (3 - 2 * t);
    return b * v + a * (1 - v);
};

function lerp(a, b, t) {
    return b * t + a * (1 - t);
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

    if ( currentApple < apples.length ) {
        apples[currentApple].update();
    }

    camera.position = active_camera.getPosition( cameratarget );

    light.position.copy( camera.position );
    light.rotation.copy( camera.rotation );
}

function render() {

    /* render the 2d canvas */
    tdx.clearRect(0,0,twoDCanvas.width, twoDCanvas.height);
    
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
    
    bg = new BG();

    scene.fog = new THREE.Fog( 0x393939, 1, 3000 );

    materials = {
    "textTexture" : new THREE.MeshLambertMaterial({
        color : 0xE8B86F, blending : THREE.AdditiveBlending, transparent:false }),
    "snakeTexture" : new THREE.MeshLambertMaterial({ 
        map: THREE.ImageUtils.loadTexture("snake_texture.jpg") }),
    "appleBody" : new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture("seamless_apple.jpg") })
    };

    setLoadingBar(.8, function(){

    light = new THREE.SpotLight( 0xffffff );
    light.intensity = 0.9;
    light.position.set(100,1000,100);
    scene.add(light);

    var pointLight = new THREE.PointLight( 0x3366ff, 1.5 );
    pointLight.position.set( 0, 2000, 0 );
    scene.add( pointLight );

    var global_light = new THREE.AmbientLight( 0x303030 ); // soft white light
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


    for ( var i=0; i < 4; i++ ) {
        var lightCarpet = new LightCarpet( scene );
        lightCarpet.setPosition(new THREE.Vector3( -3850, 600, 0 ));
        lightCarpet.rotate( Math.PI/8 + Math.PI/4 * i);
        lightCarpet.tilt( .5 );

        lightCarpets.push( lightCarpet );
    }
    for ( var i=0; i < 4; i++ ) {
        var lightCarpet = new LightCarpet( scene );
        lightCarpet.setPosition(new THREE.Vector3( 3950, 0, 0 ));
        lightCarpet.rotate( Math.PI/8 + Math.PI/4 * i);
        lightCarpet.tilt( -0.8 );

        lightCarpets.push( lightCarpet );
    }

    currentSnakeMove = SNAKE_TRACK[0];
    currentSnakeMoveInitTime = t;

    snake = new Snake( scene, materials.snakeTexture, new THREE.Vector3( currentSnakeMove.from.x, 700, currentSnakeMove.from.z, 50 ), 50 );
    var front_snake = snake;

    var newY = terrain.getYValue(currentSnakeMove.from.x, currentSnakeMove.from.z) + 25;

    for (var i = 0; i < 30; i++ ) {
        var newPosition = new THREE.Vector3( front_snake.getPosition().x, newY, front_snake.getPosition().z - 10);
        var to_be_attached = new Snake(scene, materials.snakeTexture, newPosition, 40 - 5 * Math.sin(i/2) );
        front_snake.setPrevious(to_be_attached);
        front_snake = to_be_attached;
    }
    
    cameratarget = snake.getPosition();

    apples = [];
    currentApple = 0;
    numberOfApples = 10; // trenger ikke å fylle apples her i fra, så lenge det gjøres en plass
    for ( var i = 0; i < numberOfApples; i++ ) {
        apples[i] = new Apple( scene, new THREE.Vector3( -3000 + 200 * i, terrain.getYValue( -3000 + 200 * i, 0 ) + 30, 0), 50 );
        apples[i].visibleToggle();
    }
    apples[0].visibleToggle();

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
