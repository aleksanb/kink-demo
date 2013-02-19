function BG() {
    this.t = 0;
    this.opacity = 1;
}

BG.prototype.render = function() {

    tdx.fillStyle = "rbga(0,0,0,"+this.opacity+")";

}

BG.prototype.update = function() {

}
