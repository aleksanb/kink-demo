function Apple( scene, vector, radius ) {
	this.position = vector;
	this.radius = radius;

	var appleGeometry = new THREE.SphereGeometry( radius, 20, 20 );
	var appleStilkGeometry = new THREE.SphereGeometry( radius / 2, 20, 20 );
	this.appleMesh = new THREE.Mesh( appleGeometry, materials.appleBody );
	this.appleStilkMesh = new THREE.Mesh( appleStilkGeometry, materials.appleStilk );

	this.appleMesh.position.copy( vector );
	this.appleStilkMesh.position.addVectors( vector, new THREE.Vector3( 0, radius * 3/5, 0 ) );

	scene.add( this.appleMesh );
	scene.add( this.appleStilkMesh );

}

Apple.prototype.visibleToggle = function() {
	this.appleMesh.visible = ( this.appleMesh.visible )? false : true;
	this.appleStilkMesh.visible = ( this.appleStilkMesh.visible )? false : true;
}

Apple.prototype.update = function() {
	var distance = this.position.distanceTo( snake.getPosition() );

	if ( Math.abs( distance ) < this.radius ) {
		this.appleMesh.visible = false;
		this.appleStilkMesh.visible = false;

		currentApple += 1;
        if ( currentApple < apples.length ) {
            apples[currentApple].visibleToggle();  
        }
	}
}