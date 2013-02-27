function FixedCamera( _options ) {
    var goalposition = _options.position || {
        "x": x,
        "y": y,
        "z": z
    }
    var startposition, cameraHelper;

    this.init = function( prevCamera ) {
        startposition = (_options.startposition) || (prevCamera.position);
        cameraHelper = new CameraHelper( _options );

        return startposition;
    };

    this.getPosition = function( target ) {
        return cameraHelper.animate( startposition, goalposition );
    };
}

function TrackingCamera( _options ) {
    if (!_options.position) {
        _options.position = {"x":0, "y":0, "z":0};
    }
    var relative_position = _options.position;
    var startposition, cameraHelper;

    this.init = function( prevCamera ) {
        if (_options.startposition !== undefined) {
            startposition = _options.startposition;
        } else {
            startposition = prevCamera.position;
        }
        cameraHelper = new CameraHelper( _options );

        return startposition;
    };

    this.getPosition = function( target ) {
        var new_position = cameraHelper.animate( startposition, relative_position );

        return {
            "x": target.x + new_position.x,
            "y": target.y + new_position.y,
            "z": target.z + new_position.z
        };
    };
}

function CameraHelper( _options ) {
    var cameraMovementDone = true;
    if (_options.animate) {
        startTime = t;
        endTime = t + ( _options.duration || 1000);
        cameraMovementDone = false;
    }

    this.animate = function(startposition, goalposition) {

        /* interpolate camera movement */
        var position = {};
        if (!cameraMovementDone) {
            var interpolt = (t-startTime) / (endTime-startTime);
            if (interpolt >=0 && interpolt < 1) {
                position.x = smoothstep(startposition.x, goalposition.x, interpolt);
                position.y = smoothstep(startposition.y, goalposition.y, interpolt);
                position.z = smoothstep(startposition.z, goalposition.z, interpolt);
            } else {
                position.x = goalposition.x;
                position.y = goalposition.y;
                position.z = goalposition.z;
                cameraMovementDone = true;
            }
            return position;
        }
        return goalposition;
    };
}
