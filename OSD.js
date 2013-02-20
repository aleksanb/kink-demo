function OSD(){

    this.text = "KINK is not Kinect";
    this.boxstart = GU;
    this.boxwidth = 4*GU;
    this.t = 0;
    this.textlength = 0;
    this.opacity = 1;
    this.idealtextlength = 21;
}

OSD.prototype.render = function(){
    tdx.fillStyle = "rgba(0,0,0,"+(this.opacity/2)+")";
    tdx.fillRect(this.boxstart*GU, 7*GU, GU*this.boxwidth*Math.sqrt(this.text.length/this.idealtextlength), GU);
    tdx.fillStyle = "rgba(255,255,255,"+this.opacity+")";
    tdx.fillText(this.text.substring(0, this.textlength),GU*(this.boxstart+.25), 7.25*GU);
}

OSD.prototype.show = function(text){
    this.text = text;
    this.t = 0;
    this.boxstart = 1;
    this.boxwidth = 4;
    this.textlength = 0;
    this.opacity = 1;
}

OSD.prototype.update = function(){
    
    if(this.t <= 100){
        this.boxstart = smoothstep(0, 1, this.t/100);
        this.boxwidth = smoothstep(0, 4*Math.sqrt(this.text.length/this.idealtextlength), Math.min(this.t/50,1));
    }
    if(this.t > 50 && this.t <= 150){
        this.textlength = 0|smoothstep(0, this.text.length, Math.min((this.t-50)/10,1))+1;
    }else if(this.t > 200*this.text.length/this.idealtextlength){
        this.opacity = smoothstep(1,0,Math.min((this.t-200)/50,1));
    }
    
    
    this.t++;
}

