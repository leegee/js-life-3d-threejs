require.config({
    baseUrl: "lib/",
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
    require(['../main']);
}





