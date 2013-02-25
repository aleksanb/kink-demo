function Snake(scene, material) {
    this.length;
    this.position = {"x":0,"y":1000,"z":0};
    var sphereGeometry = new THREE.SphereGeometry( 50 );
    this.mesh = new THREE.Mesh( sphereGeometry, material );
    this.mesh.position = this.position;
    scene.add(this.mesh);

}
Snake.prototype.update = function() {
    this.position.x = t/10;
    this.position.y = 1000+t/100;

    this.mesh.position = this.position;
}
Snake.prototype.render = function() {
    
}
