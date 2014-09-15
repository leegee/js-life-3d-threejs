// to depend on a bower installed component:
// define(['bower_components/componentName/file'])

define(["Base", "three"], function (Base, THREE) {
    'use strict';

    var Cell = function Cell (options) {
        Base.call(this, options);
        // console.debug('New cell', this);
        this.inMatrix = {
            x : this.x,
            y : this.y,
            z : this.z
        };
        this.x = this.x * this.geometry.parameters.radius * this.padFactor.x;
        this.y = this.y * this.geometry.parameters.radius * this.padFactor.y;
        this.z = this.z * this.geometry.parameters.radius * this.padFactor.z;
        this.x = this.x + this.geometry.parameters.radius + (2*(this.offset.x + this.padFactor.x));
        this.y = this.y + this.geometry.parameters.radius + (2*(this.offset.y + this.padFactor.y));
        this.z = this.z + this.geometry.parameters.radius + (2*(this.offset.z + this.padFactor.z));

        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.mesh.matrixAutoUpdate = false;
        this.changed = true;
    };

    Cell.prototype = Object.create( Base.prototype  );
    Cell.prototype.constructor = Cell;
    Cell.prototype.options = {
        padFactor: { x:0.5, y:0.5, z:0.5 },
        offset: { x:10, y:10, z:10 }
    };

    Cell.prototype.addToScene = function (scene) {
        console.log("Cell.addToScene at %d, %d, %d", this.x, this.y, this.z);
        scene.add( this.mesh );
    };

    Cell.prototype.render = function () {
        this.mesh.position.set(this.x, this.y, this.z );
        this.mesh.visible = this.alive;
        this.mesh.updateMatrix();
        // console.log("Cell at %d,%d = %s = [%d, %d]", this.inMatrix.x, this.inMatrix.y, this.alive, this.x, this.y);
    };

    Cell.prototype.setAlive = function (alive) {
        // console.log("Alive? %s, %s %s", this.inMatrix.x, this.inMatrix.y, alive);
        this.changed = alive !== this.alive;
        this.mesh.visible = this.alive = alive;
    };

    Cell.prototype.setState = function (numberOfNeighbours) {
        if (this.threed) alert('oops')
        var live = this.threed? (
            (numberOfNeighbours > 3 && numberOfNeighbours < 18) || numberOfNeighbours >= 25
        ) : (
            ( this.alive && numberOfNeighbours > 1 && numberOfNeighbours < 4)
            || ((!this.alive) && numberOfNeighbours === 3)
        );
        // console.log( "%d,%d,%d = %s = n %d -> live on? %s", this.inMatrix.x, this.inMatrix.y, this.inMatrix.z, this.alive, numberOfNeighbours, live);
        this.setAlive( live );
    };

    return Cell;
});
