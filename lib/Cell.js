// to depend on a bower installed component:
// define(['bower_components/componentName/file'])

define(["Base", "three"], function (Base, THREE) {

    var Cell = function Cell (options) {
        Base.call(this, options);
        console.info('New cell', this);
        this.inMatrix = {
            x : this.x,
            y : this.y,
            z : this.z
        };
        this.x = this.x * this.geometry.parameters.radius * this.padFactor.x;
        this.y = this.y * this.geometry.parameters.radius * this.padFactor.y;
        this.z = this.z * this.geometry.parameters.radius * this.padFactor.z;
        this.x = this.x + this.offset.x - (this.geometry.parameters.radius);
        this.y = this.y + this.offset.y - (this.geometry.parameters.radius);
        this.z = this.z + this.offset.z - (this.geometry.parameters.radius);

        this.mesh = new THREE.Mesh( this.geometry, this.material );
    };

    Cell.prototype = Object.create( Base.prototype  );
    Cell.prototype.constructor = Cell;
    Cell.prototype.options = {
        padFactor: 0.5
    };

    Cell.prototype.addToScene = function (scene) {
        console.log("added at %d, %d, %d", this.x, this.y, this.z);
        scene.add( this.mesh );
    };

    Cell.prototype.render = function () {
        this.mesh.position.set(this.x, this.y, this.z );
        this.mesh.visible = this.alive;
    };

    Cell.prototype.determineState = function (numberOfNeighbours) {
        this.alive = (numberOfNeighbours > 1 && numberOfNeighbours < 4)
            || numberOfNeighbours === 3;
        // console.log('n=%d, alive=%s', numberOfNeighbours, this.alive);
    };

    return Cell;
});
