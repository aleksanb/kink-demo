function Snake(scene, material, x, y, z) {
    this.length;
    this.position = new THREE.Vector3( x || 0, y || 400, z || 0 )

    var sphereGeometry = new THREE.SphereGeometry( 50 );
    this.mesh = new THREE.Mesh( sphereGeometry, material );
    this.mesh.position = this.position;
    scene.add(this.mesh);

}
Snake.prototype.update = function(x, y, z) {
	this.position.set( x, y, z );
	this.mesh.position.set( x, y, z );
}
Snake.prototype.render = function() {
    
}
