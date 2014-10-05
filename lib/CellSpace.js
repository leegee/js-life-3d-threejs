// to depend on a bower installed component:
// define(['bower_components/componentName/file'])

/** The cell space **/

define(["Base", "Cell"], function (Base, Cell) {
    'use strict';

    function CellSpace (options) {
        console.group('New Cellspace', options);

        Base.call(this, options);
        this.generation = 0;
        this.space = [];
        this.collidableMeshList = [];

        if (this.map){
            this.matrix.x = this.map.length -1;
            this.matrix.y = this.map[0].length -1;
            this.matrix.z = this.map[0][0] instanceof Array?
                this.map[0][0].length -1 : 0;
        }

        for (var x=0; x <= this.matrix.x; x++){
            this.space[x] = [];
            for (var y=0; y <= this.matrix.y; y++){
                this.space[x][y] = [];
                var z = 0;
                if (this.matrix.z > 0){
                    for (z=0; z <= this.matrix.z; z++ ){
                        this.space[x][y][z] = this.spawn(
                            x, y, z,
                            this.map? this.map[x][y][z]!==0 : (Math.random() > 0.66)
                        );
                    }
                }
                // 2d
                else {
                    this.space[x][y][z] = this.spawn(
                        x, y, z,
                        this.map? this.map[x][y]!==0 : (Math.random() > 0.66)
                    );
                }

                this.collidableMeshList.push(
                    this.space[x][y][z].mesh
                );
            }
        }

        console.groupEnd();
    }

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
        console.group('Spawn %d, %d, %d, alive=%s', x, y, z, alive);
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
                x: (this.screenWidth /2) * -0.5,
                y: (this.screenHeight/2) * -0.5,
                z: (this.screenHeight/2) * -0.5
            }
        });
        this.onNewCell( cell );
        console.groupEnd();
        return cell;
    };

    CellSpace.prototype.countNeighbours = function (px, py, pz) {
        var n = 0;
        for (var x=px-1; x <= px+1; x++){
            if (x < 0 || x >= this.space.length) continue;
            for (var y=py-1; y <= py+1; y++){
                if (y < 0 || y >= this.space[x].length) continue;
                for (var z=pz-1; z <= pz+1; z++){
                    if (z < 0 || z >= this.space[x][y].length) continue;
                    if (x === px && y === py && pz === z) continue;
                    if (this.space[x][y][z].alive){
                        n++;
                    }
                }
            }
        }

        return n;
    };

    CellSpace.prototype.countRayNeighbours = function (cell) {
        var step = 1,
            n = 0,
            i = 0,
            originVector = cell.mesh.position.clone(),
            collidableMeshList = [];

        for (i in this.collidableMeshList){
            if (this.collidableMeshList[i].visible){
                collidableMeshList.push( this.collidableMeshList[i] );
            }
        }

        for ( i in collidableMeshList){
            if (! collidableMeshList[i].visible) {
                continue;
            }

            // var localVertex = cell.mesh.geometry.vertices[vertexIndex].clone();
            // var globalVertex = localVertex.applyMatrix4( cell.mesh.matrix );
            var globalVertex = collidableMeshList[i].position.clone();
            var directionVector = globalVertex.sub( cell.mesh.position );

            var ray = new THREE.Raycaster(
                originVector,
                directionVector.clone().normalize(),
                cell.geometry.parameters.radius , // near
                cell.geometry.parameters.radius * 2 // far
            );

            var nlocal = 0;
            var collisionResults = ray.intersectObjects( collidableMeshList );
            // n += collisionResults.length;

            for (var i in collisionResults){
                if (collisionResults[i].distance < directionVector.length() ){
                    nlocal ++;
                }
            }
            n += nlocal;
        }
        // alert( cell.inMatrix.x+','+cell.inMatrix.y+' n='+n)

        return n;
    };

    CellSpace.prototype.generate = function () {
        var self = this;
        var cells = [];
        this.generation ++;

        this.forAllCells( function (cell) {
            var n = self.countNeighbours(
                cell.inMatrix.x, cell.inMatrix.y, cell.inMatrix.z
            );
            // var n = self.countRayNeighbours(cell);
            cells.push( [cell, n ] );
        });

        // Update after computation so as not to effect outcome
        for (var i in cells){
            cells[i][0].setState( cells[i][1] );
        }
    };

    CellSpace.prototype.hasChanged = function () {
        var changed = false;
        this.forAllCells( function (cell){
            if (cell.changed){
                changed = true;
                return;
            }
        });
        if (!changed){
            console.info("No change in generation %d.", this.generation)
        }
        return changed;
    };

    return CellSpace;
});
