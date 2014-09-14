// to depend on a bower installed component:
// define(['bower_components/componentName/file'])

/** The cell space **/

define(["Base", "Cell", "three"], function (Base, Cell, THREE) {

    function CellSpace (options) {
        console.group('New Cellspace', options);
        var self = this;
        Base.call(this, options);
        this.space = [];

        for (var x=0; x < this.matrix.x; x++){
            this.space[x] = [];
            for (var y=0; y < this.matrix.y; y++){
                this.space[x][y] = [];
                for (var z=0; z < this.matrix.z; z++){
                    this.space[x][y][z] = this.spawn(
                        x,
                        y,
                        z,
                        1 // Math.random(1) > 0.5
                    );
                }
            }
        }

        // this.forAllCells( function (cell) {
        //     self.onNewCell( cell );
        // });

        console.groupEnd();
    };

    CellSpace.prototype = Object.create( Base.prototype  );
    CellSpace.prototype.constructor = CellSpace;
    CellSpace.prototype.options = {
        padFactor : {
            x: 2,
            y: 2,
            z: 2
        },
    };

    CellSpace.prototype.forAllCells = function (callback) {
        for (var x=0; x < this.matrix.x; x++){
            for (var y=0; y < this.matrix.y; y++){
                for (var z=0; z < this.matrix.z; z++){
                    callback.call( this, this.space[x][y][z] );
                }
            }
        }
    };

    CellSpace.prototype.spawn = function (x, y, z, alive) {
        console.group('Spawn %d, %d, %d', x, y, z);
        var cell = new Cell({
            x        : x,
            y        : y,
            z        : z,
            alive    : alive,
            padFactor: this.padFactor,
            geometry : this.geometry,
            material : this.material,
            offset   : {
                x: (this.screenWidth /2) * -.5,
                y: (this.screenHeight/2) * -.5,
                z: (this.screenHeight/2) * -.5
            }
        });
        this.onNewCell( cell );
        console.groupEnd();
        return cell;
    };

    CellSpace.prototype.countNeighbours = function (spaceCopy, px, py, pz) {
        var n = 0;
        for (var x=px-1; x <= px+1; x++){
            if (x >= 0 && x < this.space.length){
                for (var y=py-1; y <= py+1; y++){
                    if (y >= 0 && y < this.space[x].length){
                        for (var z=pz-1; z <= pz+1; z++){
                            if (z >= 0 && z < this.space[x][y].length){
                                if (spaceCopy[x][y][z].alive) n++;
                            }
                        }
                    }
                }
            }
        }
        return n;
    };

    CellSpace.prototype.generate = function () {
        var spaceCopy = this.space;
        this.forAllCells( function (cell) {
            cell.setState(
                this.countNeighbours(
                    spaceCopy,
                    cell.inMatrix.x, cell.inMatrix.y, cell.inMatrix.z
                )
            );
        });
    };

    return CellSpace;
});
