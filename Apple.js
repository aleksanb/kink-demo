function Apple( scene, vector, radius ) {
	this.position = vector;
	this.radius = radius;


	var appleGeometry = new THREE.SphereGeometry( radius, 20, 20 );
	this.appleMesh = new THREE.Mesh( appleGeometry, materials.appleBody );

	this.appleMesh.position.copy( vector );
	scene.add( this.appleMesh );

}

Apple.prototype.visibleToggle = function() {
	this.appleMesh.visible = ( this.appleMesh.visible )? false : true;
}

Apple.prototype.update = function() {
	var distance = this.position.distanceTo( snake.getPosition() );

	if ( Math.abs( distance ) < this.radius ) {
		if (currentApple < apples.length-1) {
			this.appleMesh.visible = false;
		}

		currentApple += 1;
        if ( currentApple < apples.length ) {
            apples[currentApple].visibleToggle();  
        }
	}
}