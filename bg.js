function BG() {

    this.geometry = new THREE.Geometry();
    this.colors = [];
    this.texture = new THREE.Texture(this.generateSprite());
    this.texture.needsUpdate = true;
    this.NUM_PARTICLES = 2000;
    this.material;
    this.particleSystem;
    this.attributes = [];
}

BG.prototype.init = function() {

    for(var i = 0; i < this.NUM_PARTICLES; i++) {
        this.colors[i] = new THREE.Color();
        this.colors[i].setHSV(Math.random(), 1.0, 1.0);

        var px = Math.random() * 8000 - 4000 + Math.random() * 1000;
        var py = Math.random() * 8000 - 4000;
        var pz = Math.random() * 8000 + Math.random() * 1000 - 4000;
        var vertex = new THREE.Vector3(px,py,pz);
        this.geometry.vertices.push(vertex);
        this.attributes.push(vertex.clone());
    }

    this.geometry.colors = this.colors;

    this.material = new THREE.ParticleBasicMaterial( {
            size: 20,
            map: this.texture,
            blending: THREE.AdditiveBlending,
            depthTest: true,
            transparent: true,
            opacity: 0.7,
            vertexColors: true
    });

    this.particleSystem = new THREE.ParticleSystem( this.geometry, this.material);

    scene.add(this.particleSystem);

}

BG.prototype.render = function () {

}

BG.prototype.update = function(){

    var particleCount = this.NUM_PARTICLES;
    while(particleCount--) {
        var particle = this.geometry.vertices[particleCount];
        var startPos = this.attributes[particleCount];

        particle.x = startPos.x + Math.sin(t/5000)*100;
        particle.y = (particleCount&1) ? startPos.y + Math.abs(Math.sin(t/5000)*100):startPos.y - Math.abs(Math.sin(t/5000)*100);
        particle.z = startPos.z + (particleCount % 128)*0.1;
       
    }

    this.geometry.verticesNeedUpdate = true;

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
