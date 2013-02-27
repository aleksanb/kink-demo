function LightCarpet( scene ) {
    var geometry = new THREE.PlaneGeometry( 100, 8000, 1, 1 );
    var material = new THREE.MeshBasicMaterial( {
        color: Math.random() * 0xffffff,
        opacity: 0.5,
        side: THREE.DoubleSide,
        transparent: true
    } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.rotation.x = Math.PI/2;

    scene.add( mesh );
    console.log("lightCarpet: %o", mesh);

    this.setPosition = function(pos) {
        mesh.position = pos;
    };
    this.rotate = function( angle ) {
        mesh.rotation.z = angle;
    };
    this.tilt = function( angle ) {
        mesh.rotation.y = angle;
    };
    this.update = function() {
        // fancy visible-toggling here
        if ( material.opacity <= 0 && t % 768 < 20 ) {
            material.opacity = .8;
        }
        if ( material.opacity > 0) {
            material.opacity -= .05;
        }
    };
}
