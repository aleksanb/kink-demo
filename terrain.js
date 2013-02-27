function Terrain( width, depth ) {
	this.data;
	this.canvasScaled;
	this.w = width || 192;
	this.d = depth || 192;
    this.factor = 40;

	this.generateHeight();
	this.generateTexture();

	this.geometry = new THREE.PlaneGeometry( 
            this.w*this.factor,
            this.d*this.factor,
            this.w - 1,
            this.d - 1
            );
	this.geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

	for ( var i = 0, l = this.geometry.vertices.length; i < l; i ++ ) {
		this.geometry.vertices[i].y = this.data[i] * 10;
	}

	this.texture = new THREE.Texture(
            this.canvasScaled,
            new THREE.UVMapping(),
            THREE.ClampToEdgeWrapping,
            THREE.ClampToEdgeWrapping
            );
	this.texture.needsUpdate = true;

	this.mesh = new THREE.Mesh(
            this.geometry,
            new THREE.MeshBasicMaterial( { map: this.texture } )
            );

}

Terrain.prototype.generateHeight = function() {
	var size = this.w * this.d;
	this.data = new Float32Array( size );
	var perlin = new ImprovedNoise();
	var quality = 1;
	var z = Math.random()*100;

	for ( var i = 0; i < size; i++ ) {

		this.data[i] = 0;

	}

	for ( var j = 0; j < 4; j++ ) {

		for ( var i = 0; i < size; i++ ) {

			var x = i % this.w, y = ~~ ( i / this.w );
			this.data[i] += Math.abs( 
				perlin.noise( 
					x / quality,
					y / quality, 
					z
				) * quality
			)
		}

		quality *= 5;

	}
};

Terrain.prototype.generateTexture = function() {

	var canvas, canvasScaled, context, image, imageData,
				level, diff, vector3, sun, shade;

	vector3 = new THREE.Vector3( 0, 0, 0 );

	sun = new THREE.Vector3( 1, 1, 1 );
	sun.normalize();

	canvas = document.createElement( 'canvas' );
	canvas.width = this.w;
	canvas.height = this.d;

	context = canvas.getContext( '2d' );
	context.fillStyle = '#000';
	context.fillRect( 0, 0, this.w, this.d );

	image = context.getImageData( 0, 0, canvas.width, canvas.height );
	imageData = image.data;

	for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

		vector3.x = this.data[ j - 2 ] - this.data[ j + 2 ];
		vector3.y = 2;
		vector3.z = this.data[ j - this.w * 2 ] - this.data[ j + this.w * 2 ];
		vector3.normalize();

		shade = vector3.dot( sun );

		imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + this.data[ j ] * 0.007 );
		imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + this.data[ j ] * 0.007 );
		imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + this.data[ j ] * 0.007 );
	}

	context.putImageData( image, 0, 0 );

	// Scaled 4x

	this.canvasScaled = document.createElement( 'canvas' );
	this.canvasScaled.width = this.w * 4;
	this.canvasScaled.height = this.d * 4;

	context = this.canvasScaled.getContext( '2d' );
	context.scale( 4, 4 );
	context.drawImage( canvas, 0, 0 );

	image = context.getImageData( 0, 0, this.canvasScaled.width, this.canvasScaled.height );
	imageData = image.data;

    var rands = [];

	for ( var i = 0, l = imageData.length; i < l; i += 4 ) {

		var v = ~~ ( Math.random() * 5 );

		imageData[ i ] += v;
		imageData[ i + 1 ] += v;
		imageData[ i + 2 ] += v;

	}

	context.putImageData( image, 0, 0 );

};	

Terrain.prototype.getYValue = function(x,z) {
    if ( z > this.w*this.factor/2
        || z < -this.w*this.factor/2
        || x > this.d*this.factor/2
        || x < -this.d*this.factor/2) {
        return false;
    }

	var scaled_x = ( x / this.factor ) | 0;
	var scaled_z = ( z / this.factor ) | 0;

    var dataIndex = ( this.w/2 + scaled_x ) + this.w * ( this.d/2 + scaled_z);
	var height = this.data[ dataIndex ] * 10; // geometry is scaled by this value 

    return height;
};
