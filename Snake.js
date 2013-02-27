function Snake( scene, material, position, radius ) {
    this.length;
    this.radius = radius;
    this.previousSnake = null;
    this.NR_OF_JOINT = 30;

    this.submerge = false;
    this.headBob = false;

    var sphereGeometry = new THREE.SphereGeometry(radius);

    this.group = new THREE.Object3D();

    for(var i = 0; i < this.NR_OF_JOINT; i++ ) {
        var mesh = new THREE.Mesh(sphereGeometry, material);
        mesh.position.x = position.x;
        mesh.position.y = position.y;
        mesh.position.z = position.z -40*i;

        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();

        this.group.add(mesh);
    }

    scene.add(this.group);

};

Snake.prototype.toggleSubmerge = function() {
	this.submerge = !this.submerge;
}

Snake.prototype.toggleHeadBob = function() {
	this.headBob = !this.headBob;
}

Snake.prototype.setPrevious = function( previousSnake ) {
	this.previousSnake = previousSnake;
}

Snake.prototype.getPosition = function( previousSnake ) {
	return this.group.position;
}

Snake.prototype.update = function( newPos) {
    
    return;	

    /*
	if ( this.previousSnake != null ) {
		this.previousSnake.update( this.mesh.position );
	}
	
	if ( this.submerge ) {
		newPos.add( new THREE.Vector3( 0, -2 * this.radius, 0 ) );
	}

	if ( this.headBob ) {
		newPos.add( new THREE.Vector3( 0, -20 * Math.sin( t/100 ), 0 ) );
	}

	var distance = this.group.position.distanceTo(newPos);
	var distanceToGo = distance - 40; // snake segment length
	var normalizedPointer = new THREE.Vector3( 0,0,0 );

	normalizedPointer.subVectors(newPos, this.group.position);
	normalizedPointer.normalize();
	normalizedPointer.multiplyScalar(distanceToGo);
    */

    for(var i = 0; i < this.NR_OF_JOINT; i++) {
        this.group.children[i].position.x = newPos.x;
        this.group.children[i].position.y = newPos.y;
        this.group.children[i].position.z = newPos.z;
    }

};

Snake.prototype.render = function() {
    
};
