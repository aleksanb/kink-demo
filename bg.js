function BG() {

    this.geometry = new THREE.Geometry();
    this.colors = [];
    this.texture = new THREE.Texture(this.generateSprite());
    this.texture.needsUpdate = true;
    this.NUM_PARTICLES = 5000;
}

BG.prototype.init = function() {

    for(var i = 0; i < this.NUM_PARTICLES; i++) {
        this.colors[i] = new THREE.Color();
        this.colors[i].setHSV(Math.random(), 1.0, 1.0);

        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 4000 - 2000;    
        vertex.y = Math.random() * 4000 - 2000;    
        vertex.z = Math.random() * 4000;
        this.geometry.vertices.push(vertex);
    }

    this.geometry.colors = this.colors;

    var material = new THREE.ParticleBasicMaterial( {
            size: 20,
            map: this.texture,
            blending: THREE.AdditiveBlending,
            depthTest: true,
            transparent: true,
            opacity: 0.7,
            vertexColors: true
    });

    var particleSystem = new THREE.ParticleSystem( this.geometry, material);

    scene.add(particleSystem);

}

BG.prototype.render = function () {

}

BG.prototype.update = function(){


}

BG.prototype.generateSprite = function() {

    var canvas = document.createElement( 'canvas' );
    var size = 16;
    canvas.width = size;
    canvas.height = size;

    var context = canvas.getContext( '2d' );
    var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
    gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
    gradient.addColorStop( 0.2, 'rgba(0,255,255,1)' );
    gradient.addColorStop( 0.4, 'rgba(0,0,64,1)' );
    gradient.addColorStop( 1, 'rgba(0,0,0,1)' );

    context.fillStyle = gradient;
    //context.fillStyle="rgba(255,0,0,1)";
    //context.fillRect( 0, 0, canvas.width, canvas.height );
    context.beginPath();
    context.arc(size/2, size/2, size/2, 0, 2*Math.PI, false);
    context.fill();

    return canvas;
}
