// to depend on a bower installed component:
// define(['bower_components/componentName/file'])

/** The cell space **/

define(["Base", "Cell", "three"], function (Base, Cell, THREE) {

    function CellSpace (options) {
        console.group('New Cellspace', options);

        var self = this;
        Base.call(this, options);
        this.space = [];
        this.maxNeighbours = 0;

        if (this.map){
            this.matrix.x = this.map.length -1;
            this.matrix.y = this.map[0].length -1;
            this.matrix.z = typeof this.map[0][0] === 'array'?
                this.map[0][0].length -1 : 0;
        };

        for (var x=0; x <= this.matrix.x; x++){
            this.space[x] = [];
            for (var y=0; y <= this.matrix.y; y++){
                this.space[x][y] = [];
                if (this.matrix.z > 0){
                    for (var z=0; z <= this.matrix.z; z++ ){
                        this.space[x][y][z] = this.spawn(
                            x, y, z,
                            this.map? this.map[x][y][z] : (Math.random() > 0.66)
                        );
                    }
                }
                // 2d
                else {
                    this.space[x][y][0] = this.spawn(
                        x, y, 0,
                        this.map? this.map[x][y]!==0 : (Math.random() > 0.66)
                    );
                }
            }
        }

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
        for (var x=0; x <= this.matrix.x; x++){
            for (var y=0; y <= this.matrix.y; y++){
                for (var z=0; z <= this.matrix.z; z++){
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
            threed   : this.matrix.z > 0,
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

    CellSpace.prototype.countNeighbours = function (px, py, pz) {
        var n = 0;

        for (var x=px-1; x <= px+1; x++){

            if (x >= 0 && x < this.space.length){   // keep in the cellspace
                for (var y=py-1; y <= py+1; y++){

                    if (y >= 0 && y < this.space[x].length){
                        for (var z=pz-1; z <= pz+1; z++){

                            if (z >= 0 && z < this.space[x][y].length){
                                if (x != px && y != py &&
                                    ((this.space[x][y].length>1)? (z !== pz) : true)
                                ){
                                    if (this.space[x][y][z].alive){
                                        n++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if (n > this.maxNeighbours) {
            this.maxNeighbours = n;
            console.info("maxNeighbours: %d", this.maxNeighbours);
        }
        console.log('n = ',n)

        return n;
    };

    CellSpace.prototype.generate = function () {
        var self = this;
        var cells = [];

        this.forAllCells( function (cell) {
            var n = self.countNeighbours(
                cell.inMatrix.x, cell.inMatrix.y, cell.inMatrix.z
            );
            cells.push( [cell, n ] );
        });

        // Update after computation so as not to effect outcome
        for (var i in cells){
            cells[i][0].setState( cells[i][1] );
        }
    };

    return CellSpace;
});
