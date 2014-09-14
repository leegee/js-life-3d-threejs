// to depend on a bower installed component:
// define(['bower_components/componentName/file'])

/** The cell space **/

define(["Base", "Cell", "three"], function (Base, Cell, THREE) {

    function CellSpace (options) {
        console.group('New Cellspace', options);
        Base.call(this, options);

        this.space = [];
        for (var x=0; x < this.matrix.x; x++){
            this.space[x] = [];
            for (var y=0; y < this.matrix.y; y++){
                this.space[x][y] = this.spawn(
                    x,
                    y,
                    Math.random(1) > 0.5
                );
            }
        }

        console.groupEnd();
    };

    CellSpace.prototype = Object.create( Base.prototype  );
    CellSpace.prototype.constructor = CellSpace;
    CellSpace.prototype.options = {
        padFactor : {
            x: 2,
            y: 2
        },
    };

    CellSpace.prototype.forAllCells = function (callback) {
        for (var x=0; x < this.matrix.x; x++){
            for (var y=0; y < this.matrix.y; y++){
                callback.call(this, this.space[x][y]);
            }
        }
    };

    CellSpace.prototype.addToScene = function (scene) {
        if (!scene) throw new TypeError('No scene');
        this.forAllCells( function (cell) {
            cell.addToScene( scene );
        });
    };

    CellSpace.prototype.spawn = function (x, y, alive) {
        return new Cell({
            x        : x,
            y        : y,
            alive    : alive,
            padFactor: this.padFactor,
            geometry : this.geometry,
            material : this.material,
            offset   : {
                x: (this.screenWidth /2) * -.5,
                y: (this.screenHeight/2) * -.5
            }
        });
    };

    CellSpace.prototype.countNeighbours = function (px, py) {
        var n = 0;
        for (var x=px-1; x <= px+1; x++){
            if (x >= 0 && x < this.space.length){
                for (var y=py-1; y <= py+1; y++){
                    if (y >= 0 && y < this.space[x].length){
                        if (this.space[x][y].alive) n++;
                    }
                }
            }
        }
        return n;
    };

    CellSpace.prototype.generate = function () {
        this.forAllCells( function (cell) {
            cell.determineState(
                this.countNeighbours(cell.inMatrix.x, cell.inMatrix.y)
            );
            cell.render();
        });
    };

    return CellSpace;
});
