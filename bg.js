function BG() {
    this.WIDTH = 16*GU;
    this.HEIGHT = 9*GU;
    this.geometry = new THREE.Geometry();
    this.colors = [0x000000, 0xff0080, 0x042d55, 0xffffff, 0xcc00dd];
}

BG.prototype.render = function() {

}

BG.prototype.init = function() {

    for (var i = 0; i < 2000; i++) {

        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 4000 - 2000;    
        vertex.y = Math.random() * 4000 - 2000;    
        vertex.z = Math.random() * 4000 - 2000;    
        this.geometry.vertices.push(vertex);
        this.geometry.colors.push(new THREE.Color( this.colors[Math.floor(Math.random()*this.colors.length)]));

    }

    var material = new THREE.ParticleBasicMaterial({size: 100, vertexColors: THREE.VertexColors, depthTest:false, opacity: 0.5, sizeAttenuation: false, transparent: true } );

    var mesh = new THREE.ParticleSystem(this.geometry, material);
    scene.add(mesh);

}

BG.prototype.update = function() {

    

}
