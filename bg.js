function BG() {
    this.t = 0;
    this.opacity = 1;
    this.WIDTH = 16*GU;
    this.HEIGHT = 9*GU;
}

BG.prototype.render = function() {

    tdx.fillStyle = "rbga(0,0,0,"+this.opacity+")";
    tdx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

}

BG.prototype.update = function() {

}
