require.config({
    baseUrl: "lib/",
    // make components more sensible
    paths: {
        "components"    : "../bower_components",
        "three"         : "../bower_components/threejs/build//three.min",
        "OrbitControls" : "../bower_components/OrbitControls/index"
    },
    shim: {
        "three": {
            exports: "THREE"
        },
        "OrbitControls": {
            deps: ["three"]
        }
    }
});

if (!window.requireTestMode) {
    define(["Life", "three"], function main (Life, THREE) {
        var game = new Life();
        // {
        //     matrix: {
        //         x: 5,
        //         y: 5
        //     }
        // });
    });


}





