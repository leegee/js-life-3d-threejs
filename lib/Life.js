// to depend on a bower installed component:
// define(['bower_components/componentName/file'])

define([
    "Base", "Cell","CellSpace", "three", "OrbitControls"
], function (
    Base, Cell, CellSpace, THREE, OrbitControls
) {

        var Life = function  (options) {
            var self = this;
            Base.call(this, options);
            this.scene = new THREE.Scene();

            var aspectRatio = this.screenWidth / this.screenHeight;

            this.camera = new THREE.PerspectiveCamera(
                this.frustumVerticalFov,
                aspectRatio,
                this.frustumNearPlane,
                this.frustumFarPlane
            );
            this.scene.add(this.camera);
            // this.camera.position.set(0, 0, this.screenHeight*1);
            this.camera.position.set(
                0, // this.screenHeight/2,
                0, // this.screenHeight/2,
                -.5 * this.screenHeight
            );
            this.camera.setLens(4);
            this.camera.lookAt(this.scene.position);

            this.renderer = new THREE.WebGLRenderer( {antialias:true} );
            this.renderer.setSize( this.screenWidth, this.screenHeight );
            document.body.appendChild(this.renderer.domElement);

            this.light = {
                x : this.screenWidth / 2,
                y : this.screenHeight / 2,
                z : -.5 * this.screenHeight
            };
            var intensity = .9,
                distance  = 0,
                light     = new THREE.PointLight(0xffffff, intensity, distance);
            light.position.set( this.light.x, this.light.y, this.light.z); // wtf
            this.scene.add(light);

            var radius = (this.screenWidth) / ((this.matrix.x + this.matrix.y));
            console.info("Cell radius will be ", radius);

            var geometry = new THREE.SphereGeometry( radius, radius, radius ); // px
            var material = new THREE.MeshLambertMaterial( { color: 0xFFFF88 } );

            console.group();
            this.cellSpace = new CellSpace({
                geometry     : geometry,
                material     : material,
                matrix       : this.matrix,
                screenWidth  : this.screenWidth,
                screenHeight : this.screenHeight
            });
            this.cellSpace.addToScene(this.scene);
            console.groupEnd();

            // this.testShape();

            this.controls = new THREE.OrbitControls( this.camera );
            this.controls.addEventListener( 'change', this.render );
            window.addEventListener( 'resize', this.onWindowResize, false );

            var render = function () {
                requestAnimationFrame(render);
                self.renderer.render(self.scene, self.camera);
                self.controls.update();
            };
            render();

            var play = function () {
                self.cellSpace.generate();
                setTimeout( function (){
                    play.call(self);
                }, this.generationDelay);
            };
            play();

        };

        Life.prototype.onWindowResize = function () {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        };

        Life.prototype = Object.create( Base.prototype  );
        Life.prototype.constructor = CellSpace;

        Life.prototype.options = {
            screenWidth         : window.innerWidth,
            screenHeight        : window.innerHeight,
            frustumVerticalFov  : 0,
            frustumNearPlane    : 1,
            frustumFarPlane     : 20000,
            padFactor           : 1,
            matrix : {
                x  : 9,
                y  : 9
            },
            generationDelay     : 1000
        };

        Life.prototype.testShape = function () {
            var geometry = new THREE.SphereGeometry( 30, 32, 16 );
            var material = new THREE.MeshLambertMaterial( { color: 0x000088 } );
            mesh = new THREE.Mesh( geometry, material );
            mesh.position.set(0,40,0);
            this.scene.add(mesh);
        };

        return Life;
    }
);
