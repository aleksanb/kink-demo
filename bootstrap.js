FRAME_LENGTH = 882;
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

function loop(){
    dt += (t-old_time);
    old_time = t;
    while(dt> FRAME_LENGTH){
        update();
        dt-= FRAME_LENGTH;
    }
    render();
    requestAnimFrame(loop);
}


function start(){
    time = 0;
    old_time = time;
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
        }
    },0);
}

function bootstrap(){
    document.body.webkitRequestFullScreen();
    document.addEventListener("keydown",function(e){
        if(e.keyCode == /*ESC*/ 27){
            window.open('', '_self', ''); //bug fix
            window.close(); 
        }
    });
    renderer = new THREE.WebGLRenderer({ maxLights: 10,antialias:true });
    twoDCanvas = document.createElement("canvas");
    twoDCanvas.style.position = "absolute";
    twoDCanvas.style.left = "0";
    twoDCanvas.style.zIndex = "9999";
    twoDCanvas.style.background = "transparent";
    tdx = twoDCanvas.getContext("2d");
    scanlinecanvas = document.createElement("canvas");
    scanlinecanvas.style.position = "absolute";
    scanlinecanvas.style.left = "0";
    scanlinecanvas.style.zIndex = "999";
    scanlinecanvas.style.background = "transparent";
    slx = scanlinecanvas.getContext("2d");
    resize();
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(scanlinecanvas);
    document.body.appendChild(twoDCanvas);
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
    scanlinecanvas.width = 16*GU;
    scanlinecanvas.height = 9*GU;
    scanlinecanvas.style.margin = ((window.innerHeight - 9*GU) /2)+"px 0 0 "+((window.innerWidth-16*GU)/2)+"px";
    slx.fillStyle = "rgba(0,0,0,0.05)";
    for(var i=0;i<9;i++){
        slx.fillRect(0,i*GU+0.0*GU,16*GU,0.05*GU);
        slx.fillRect(0,i*GU+0.1*GU,16*GU,0.05*GU);
        slx.fillRect(0,i*GU+0.2*GU,16*GU,0.05*GU);
        slx.fillRect(0,i*GU+0.3*GU,16*GU,0.05*GU);
        slx.fillRect(0,i*GU+0.4*GU,16*GU,0.05*GU);
        slx.fillRect(0,i*GU+0.5*GU,16*GU,0.05*GU);
        slx.fillRect(0,i*GU+0.6*GU,16*GU,0.05*GU);
        slx.fillRect(0,i*GU+0.7*GU,16*GU,0.05*GU);
        slx.fillRect(0,i*GU+0.8*GU,16*GU,0.05*GU);
        slx.fillRect(0,i*GU+0.9*GU,16*GU,0.05*GU);
    }
}

window.onresize = resize;
