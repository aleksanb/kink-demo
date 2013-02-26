function Terrain( width, depth ) {
	this.data;
	this.canvasScaled;
	this.w = width || 256;
	this.d = depth || 256;

	this.generateHeight();
	this.generateTexture();

	this.geometry = new THREE.PlaneGeometry( 7500, 7500, this.w - 1, this.d - 1 );
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

	for ( var i = 0, l = imageData.length; i < l; i += 4 ) {

		var v = ~~ ( Math.random() * 5 );

		imageData[ i ] += v;
		imageData[ i + 1 ] += v;
		imageData[ i + 2 ] += v;

	}

	context.putImageData( image, 0, 0 );

};	

Terrain.prototype.getYValue = function(x,z, dx, dz) {
    if ( z > 3750 || z < -3750 || x > 3750 || x < -3750) {
        return false;
    }
    var DIVIDER = 29.412;

	var scaled_x = ( x / DIVIDER ) | 0;
	var scaled_z = ( z / DIVIDER ) | 0;

    var dataIndex = ( this.w/2 + scaled_x ) + this.w * ( this.d/2 + scaled_z);
	var height = this.data[ dataIndex ] * 10; // geometry is scaled by this value 

    /*
    var nextDataIndex = ( this.w/2 + scaled_x + dx ) + this.w * ( this.d/2 + scaled_z + dz );
    var nextHeight = this.data[ nextDataIndex ] * 10; 

    interpolt_x = ( x - this.geometry.vertices[ dataIndex ].x ) / DIVIDER * 2;
    interpolt_z = ( z - this.geometry.vertices[ dataIndex ].z ) / DIVIDER * 2;
    var interpolt = Math.sqrt( Math.pow(interpolt_x, 2) + Math.pow(interpolt_z, 2) );

    if (t < 2500) {
        console.log(interpolt_x);
    }

    var yPos = smoothstep(height, nextHeight, interpolt);
	return yPos;
    */
    return height;
};
