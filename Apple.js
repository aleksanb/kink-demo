function Apple( options ) {
	var radius = options.radius || 50;

	var appleGeometry = new THREE.SphereGeometry( radius, 20, 20 );
	this.mesh = new THREE.Mesh( appleGeometry, materials.appleBody );

	this.mesh.position.copy( options.position );

    this.update = function() {
        var distance = this.mesh.position.distanceTo( snake.getPosition() );

        if ( Math.abs( distance ) < appleGeometry.radius && currentApple < apples.length-1 ) {
            currentApple += 1;
            this.mesh.position.copy( apples[currentApple].position );
            appleGeometry.radius = apples[currentApple].radius;
            snake.addSegments( 2 );

        }
    };
}
