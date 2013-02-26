function Snake( scene, material, x, y, z, radius ) {
    this.length;
    this.radius = radius;
    this.previousSnake = null;

    var sphereGeometry = new THREE.SphereGeometry( radius );
    this.mesh = new THREE.Mesh( sphereGeometry, material );
    this.mesh.position =  new THREE.Vector3( x || 0, y || 400, z || 0 );
    scene.add(this.mesh);

};

Snake.prototype.setPrevious = function( previousSnake ) {
	this.previousSnake = previousSnake;
}

Snake.prototype.getPosition = function( previousSnake ) {
	return this.mesh.position;
}

Snake.prototype.update = function() {
	var newPos = new THREE.Vector3( 0, 0, 0 );

	if ( arguments.length == 3 ) {
		newPos.set( arguments[0], arguments[1], arguments[2] );
	} else if ( arguments.length == 1 ) {
		newPos = arguments[0];
	}
	
	if ( this.previousSnake != null ) {
		this.previousSnake.update( this.mesh.position );
	}

	var distance = this.mesh.position.distanceTo(newPos);
	var distanceToGo = distance - 20; // snake segment length
	var normalizedPointer = new THREE.Vector3( 0,0,0 );

	normalizedPointer.subVectors(newPos, this.mesh.position);
	normalizedPointer.normalize();
	normalizedPointer.multiplyScalar(distanceToGo);

	this.mesh.position.add(normalizedPointer);
};

Snake.prototype.render = function() {
    
};
