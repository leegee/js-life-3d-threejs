define(["Life", "three"], function main (Life, THREE) {

    var maps = {};
    maps.simple_osc1 = [
        [ 0, 0, 0 ],
        [ 0, 1, 0 ],
        [ 0, 1, 0 ],
        [ 0, 1, 0 ],
        [ 0, 0, 0 ]
    ];
    maps.simple_osc2 = [
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 1, 1, 1, 0 ],
        [ 0, 1, 1, 1, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ]
    ];
    maps.glider = [
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 1, 0, 0, 0, 0 ],
        [ 0, 1, 1, 0, 0, 0 ],
        [ 1, 0, 1, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ]
    ];

    var game = new Life({
        fullscreen          : true,
        screenWidth         : window.innerWidth,
        screenHeight        : window.innerHeight,
        frustumVerticalFov  : 40,
        frustumNearPlane    : .01,
        frustumFarPlane     : 20000,
        padFactor           : {x: 2.5, y: 2.5, z: 2.5},
        minFrameDuration    : 100,
        // matrix              : { x: 12, y: 12, z: 1 },
        map : maps.glider
    });
});
