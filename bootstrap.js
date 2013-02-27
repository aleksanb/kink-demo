var camera_override = false;
var developer_camera = new THREE.Vector3(0,0,0);
var developer_camera_target = new THREE.Vector3(0,0,0);
FRAME_LENGTH = 882;
t = 0;
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame    || 
    window.oRequestAnimationFrame      || 
    window.msRequestAnimationFrame     || 
    function( callback ){
        window.setTimeout(callback, 0);
    };
})();
window.makeFullscreen = function(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
};

function loop(){
    t = music.currentTime*1000;
    dt = (t-old_time);
    old_time = music.currentTime;
    while(dt> FRAME_LENGTH){
        update();
        dt-= FRAME_LENGTH;
    }

    render();
    document.querySelector("#time-counter").innerText = t|0;

    if (!music.ended)
        requestAnimFrame(loop);
}


function start(){
    old_time = 0;
    dt = 0;
    init();
}

function setLoadingBar(completed,fn){
    tdx.fillStyle = "white";
    tdx.fillRect(0,0,16*GU,9*GU);
    tdx.fillStyle = "black";
    tdx.fillRect(GU, 4.25*GU,14*GU*completed ,GU*0.5);
    console.log("LOADING",completed);
    setTimeout(function(){
        fn();
        if(completed == 1){
            tdx.clearRect(0,0,16*GU,9*GU);
            requestAnimFrame(loop);
            music.play();
        }
    },0);
}

function bootstrap(){
    //makeFullscreen(document.body);
    document.addEventListener("keydown",function(e){
        if(e.keyCode == /*ESC*/ 27){
            window.open('', '_self', ''); //bug fix
            window.close(); 
        }
    });
    renderer = new THREE.WebGLRenderer({ maxLights: 10,antialias:true, clearColor:0x191919, clearAlpha:1}); 
    renderer.sortObjects = false;
    twoDCanvas = document.createElement("canvas");
    twoDCanvas.style.position = "absolute";
    twoDCanvas.style.left = "0";
    twoDCanvas.style.zIndex = "8999";
    twoDCanvas.style.background = "transparent";
    tdx = twoDCanvas.getContext("2d");
    resize();
    Math.seedrandom('kinkisawesomebitchyo');    
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(twoDCanvas);
    var file_format = Modernizr.audio.ogg ? 'ogg' : 'mp3';
    music = new Audio( "audio/soundtrack." + file_format );
    setTimeout(start,0);
}


function resize(){
    if(window.innerWidth/window.innerHeight > 16/9){
        GU = (window.innerHeight/9);
        }else{
        GU = (window.innerWidth/16);
    }
    renderer.setSize(16*GU, 9*GU);
    renderer.domElement.style.margin = ((window.innerHeight - 9*GU) /2)+"px 0 0 "+((window.innerWidth-16*GU)/2)+"px";
    twoDCanvas.width = 16*GU;
    twoDCanvas.height = 9*GU;
    twoDCanvas.style.margin = ((window.innerHeight - 9*GU) /2)+"px 0 0 "+((window.innerWidth-16*GU)/2)+"px";
    tdx.font = (GU/3)+"pt BebasNeue";
    tdx.textBaseline = "top";
}

window.onresize = resize;
addEventListener('keydown', function(e) {
    var factor = 35;
   if ( e.keyCode == 32) {
       camera_override = !camera_override;
       snake.visibleToggle();
   }
    if ( e.keyCode == 37 ) {
        developer_camera.x-=factor;
    }
    if ( e.keyCode == 38 ) {
        developer_camera.z-=factor;

    }
    if ( e.keycode == 39 ) {
        developer_camera.x+=factor;
    }
    if ( e.keyCode == 40 ) {
        developer_camera.z+=factor;
    }
    if ( e.keyCode == 85 ) {
        developer_camera.y+=factor;
    }
    if ( e.keyCode == 78 ) {
        developer_camera.y-=factor;
    }
    if ( e.keyCode == 65 ) {
        developer_camera_target.x-=factor;
    }
    if ( e.keyCode == 87 ) {
        developer_camera_target.z-=factor;
    }
    if ( e.keyCode == 68 ) {
        developer_camera_target.x+=factor;
    }
    if ( e.keyCode == 83 ) {
        developer_camera_target.z+=factor;
    }

});
