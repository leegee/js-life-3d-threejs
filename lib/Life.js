// to depend on a bower installed component:
// define(['bower_components/componentName/file'])

define([
    "Base", "Cell","CellSpace", "three", "OrbitControls"
], function (
    Base, Cell, CellSpace, THREE
) {
    'use strict';

    var Life = function  (options) {
        Base.call(this, options);

        var self = this;
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer( {antialias:true} );
        this.renderer.setSize( this.screenWidth, this.screenHeight );
        document.body.appendChild(this.renderer.domElement);

        var intensity = 0.9,
            distance  = 0,
            light     = new THREE.PointLight(0xffffff, intensity, distance);

        light.position.set( this.lightPosition.x, this.lightPosition.y, this.lightPosition.z);
        this.scene.add(light);

        var radius = (this.screenWidth) / ((this.matrix.x + this.matrix.y));
        console.info("Cell radius will be ", radius);

        var geometry = new THREE.SphereGeometry( radius, radius, radius ); // px
        var material = new THREE.MeshLambertMaterial( { color: 0xFFFF88 } );

        var aspectRatio = this.screenWidth / this.screenHeight;
        this.camera = new THREE.PerspectiveCamera(
            this.frustumVerticalFov,
            aspectRatio,
            this.frustumNearPlane,
            this.frustumFarPlane
        );
        this.scene.add(this.camera);
        this.camera.position.set(
            this.cameraPosition.x,
            this.cameraPosition.y,
            this.cameraPosition.z
        );
        this.camera.lookAt(this.scene.position);

        var render = function () {
            // requestAnimationFrame(render);
            self.renderer.render(self.scene, self.camera);
            // self.controls.update();
        };

        this.controls = new THREE.OrbitControls( this.camera );
        this.controls.addEventListener( 'change', render );

        if (this.fullscreen){
            window.addEventListener( 'resize', this.onWindowResize, false );
        }

        console.group();
        this.cellSpace = new CellSpace({
            geometry     : geometry,
            material     : material,
            matrix       : this.matrix,
            map          : this.map,
            padFactor    : this.padFactor,
            screenWidth  : this.screenWidth,
            screenHeight : this.screenHeight,
            onNewCell    : function (cell) {
                cell.render();
                cell.addToScene( self.scene );
            }
        });
        render();
        console.groupEnd();

        var play = function play () {
            var t = new Date().getTime();
            // console.time('generate');
            self.cellSpace.generate();
            // console.timeEnd('generate');

            requestAnimationFrame(render);
            self.controls.update();
            // Too fast using
            //      requestAnimationFrame(play);
            var d = new Date().getTime() - t;
            var pause = (d < self.minFrameDuration)? self.minFrameDuration - d : 0;
            if (self.cellSpace.hasChanged())
                setTimeout( play, pause );
        };
        setTimeout( play, this.minFrameDuration );
    };

    Life.prototype.onWindowResize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    };

    Life.prototype = Object.create( Base.prototype  );
    Life.prototype.constructor = CellSpace;

    Life.prototype.options = {
        fullscreen          : true,
        screenWidth         : window.innerWidth,
        screenHeight        : window.innerHeight,
        frustumVerticalFov  : 40,
        frustumNearPlane    : 0.01,
        frustumFarPlane     : 20000,
        padFactor           : { x : 1, y : 1, z : 1},
        matrix              : { x : 5, y : 5, z : 1 },
        minFrameDuration    : 800,
        cameraPosition: {
            x: 0, // window.innerWidth  / 2,
            y: 0, // window.innerHeight / 2,
            z: (window.innerWidth / 2) * -20
        },
        lightPosition : {
            x : 0,
            y : 0, //this.screenHeight / 2,
            z : -1 * window.innerHeight
        }
    };

    Life.prototype.testShape = function () {
        var geometry = new THREE.SphereGeometry( 30, 32, 16 );
        var material = new THREE.MeshLambertMaterial( { color: 0x000088 } );
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.set(0,40,0);
        this.scene.add(mesh);
    };

    return Life;
});
