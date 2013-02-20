function Terrain( width, height ) {
	this.data;
	this.canvasScaled;
	this.w = width || 256;
	this.h = height || 256;
}

Terrain.prototype.generateHeight = function() {
	var size = this.w * this.h;
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
				) * quality * 1.75
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
	canvas.height = this.h;

	context = canvas.getContext( '2d' );
	context.fillStyle = '#000';
	context.fillRect( 0, 0, this.w, this.h );

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
	this.canvasScaled.height = this.h * 4;

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