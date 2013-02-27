function LightCarpet( scene ) {
    var geometry = new THREE.PlaneGeometry( 100, 5000, 1, 1 );
    var material = new THREE.MeshLambertMaterial( {
        color: Math.random() * 0xffffff,
        opacity: 0.5,
        side: THREE.DoubleSide
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
}
