function FixedCamera( options ) {
    var cameraMovementDone = true;
    var goalposition = options.position || {
        "x": x,
        "y": y,
        "z": z
    }
    var startposition, startTime, endTime;

    this.init = function( prevCamera ) {
        startposition = (options.startposition) || (prevCamera.position);
        if (options.animate) {
            startTime = t;
            endTime = t + (options.duration || 1000);
            cameraMovementDone = false;
        }
        console.log("options on init: %o", options);
        console.log("init time: %i", t);

        return startposition;
    };

    this.getPosition = function( target ) {
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
function TrackingCamera( options ) {
    var cameraMovementDone = true;
    if (!options.position) {
        options.position = {"x":0, "y":0, "z":0};
    }
    var relative_position = options.position;
    var startposition, startTime, endTime;

    this.init = function( prevCamera ) {
        startposition = (options.startposition) || (prevCamera.position);
        if (options.animate) {
            startTime = t;
            endTime = t + (options.duration || 1000);
            cameraMovementDone = false;
        }
        console.log("init trackingCamera");
        console.log("options on init: %o", options);
        console.log("init time: %i", t);

        return startposition;
    };

    this.getPosition = function( target ) {
        /* interpolate camera movement */
        var position = {};
        if (!cameraMovementDone) {
            var interpolt = (t-startTime) / (endTime-startTime);
            if (interpolt >=0 && interpolt < 1) {
                position.x = smoothstep(startposition.x, relative_position.x, interpolt);
                position.y = smoothstep(startposition.y, relative_position.y, interpolt);
                position.z = smoothstep(startposition.z, relative_position.z, interpolt);
            } else {
                position.x = relative_position.x;
                position.y = relative_position.y;
                position.z = relative_position.z;
                cameraMovementDone = true;
            }
            return {
                "x": target.x + position.x, 
                "y": target.y + position.y, 
                "z": target.z + position.z, 
            };
        }

        return {
            "x": target.x + relative_position.x, 
            "y": target.y + relative_position.y, 
            "z": target.z + relative_position.z, 
        };
    };
}

