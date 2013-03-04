var active_camera_index = 0;
var active_camera, camera_helper;
var camera_timestamps;
var camera, scene, side, x_spacing, z_spacing, cameratarget;
var bg, snake, terrain;
var apple, apples, currentApple, numberOfApples;
var materials, light, cameraskip, fadeStartTime, fadeGoalTime, fadeStart, fadeGoal, fadeFn;
var currentSnakeMove, currentSnakeMoveInitTime;
var skybox, lightCarpets = [];

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
    snake.update( newGoal.clone() );

    var prevTarget = cameratarget.clone();
    var newTarget = snake.getPosition().clone(); 
    //if (newTarget.y-prevTarget.y > .0001) { newTarget.y = prevTarget.y + .0001; }
    //if (prevTarget.y-newTarget.y > .0001) { newTarget.y = prevTarget.y - .0001; }

    cameratarget = newTarget.clone();


    for ( var i=0; i < TEXTS.length; i++ ) {
        var text = TEXTS[i];
        if (text.visibleToggle && text.visibleToggle.length > 0) {
            if ( t > text.visibleToggle[0] ) {
                text.visibleToggle.shift();
                text.object.visible = !text.object.visible;
            }
        }
    }

    apple.update();


    if ( t > 14000 && t < 16000) {
        snake.headBob = true;
    } else if (t > 45000 && t < 47000) {
        snake.headBob = false;
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

        // DON'T ADD ANYTHING BEFORE HERE
        scene = new THREE.Scene();

        terrain = new Terrain(192, 192);
        scene.add(terrain.mesh);
        //terrain = {};
        //terrain.getYValue = function(){return 600};
        //
        // SAFE TO ADD

        camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);
        camera_timestamps = Object.keys(CAMERA_POSITIONS).sort(function(a,b){return a-b});
        active_camera = CAMERA_POSITIONS[ camera_timestamps[active_camera_index] ];
        camera.position = active_camera.init( camera );

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

            var name1Light = new THREE.DirectionalLight(0xffffff, 1);
            name1Light.position.set(0,0,0);
            name1Light.target.position = new THREE.Vector3(1600,640,-350);
            scene.add(name1Light);

            cameraskip = false;

            bg.init();

            currentSnakeMove = SNAKE_TRACK[0];
            currentSnakeMoveInitTime = t;

            snake = new Snake( 
                    scene, materials.snakeTexture, 
                    new THREE.Vector3( 
                        currentSnakeMove.from.x, 
                        700, currentSnakeMove.from.z, 
                        50 
                        ), 
                    50, 5 
                    );

            cameratarget = snake.getPosition();

            apples = [
            {
                position: new THREE.Vector3( -2800, terrain.getYValue( -2800, 0 ) + 30, 0),
                    radius: 50
            },
            {
                position: new THREE.Vector3( 3000, terrain.getYValue( 3000, 120 ) + 30, 120),
                radius: 50
            },
            {
                position: new THREE.Vector3( 2700, terrain.getYValue( 2700, 1000 ) + 30, 1000),
                radius: 50
            },
            {
                position: new THREE.Vector3( 900, terrain.getYValue( 900, 1000 ) + 30, 1000),
                radius: 50
            },
            {
                position: new THREE.Vector3( -400, terrain.getYValue( -400, 0 ) + 30, 0),
                radius: 50
            },
            {
                position: new THREE.Vector3( -400, terrain.getYValue( -400, 0 ) + 30, 0),
                radius: 50
            },
            {
                position: new THREE.Vector3( 4600, 0, -650),
                radius: 1000
            }

        ];
    currentApple = 0;
    apple = new Apple(apples[currentApple]);
    scene.add(apple.mesh);

    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load( "sweet_glasses.js", function( geometry, materials ) { snake.attachGlasses( geometry, materials ) } );
    //jsonLoader.load( "sunglasses.js", function( geometry ) { snake.attatchGlasses( geometry ) } );
    
    /*function createScene( geometry, materials ) {
        var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials )  );
        //mesh.scale.set(.1, .1, .1);
        mesh.position.y = 1200;
        mesh.position.x = -3000;
        mesh.position.z = -2000;
        scene.add(mesh);
    }
*/

    setLoadingBar(1, function(){});

    fadeStartTime = 0;
    fadeGoalTime = 0;
    fadeStart = 0;
    fadeGoal = 0;
    fadeFn = undefined;
    fadeIn(4000);
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
        side: THREE.BackSide });

    var skybox = new THREE.Mesh( new THREE.CubeGeometry(7680, 3840, 7680, 1, 1, 1), cubeMaterial);
    skybox.position.y = 1920;
    return skybox;
}
