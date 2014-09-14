'use strict';

define( function () {

    var Base = function (options) {
        for (var i in this.options) {
            this[i] = this.options[i];
        }
        for (var i in options) {
            this[i] = options[i];
        }

        // Create an id for the element if necessary:
        var d = new Date().getTime();
        this.uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16) % 16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x7|0x8)).toString(16);
        });
    };

    Base.prototype.options = {};

    Base.prototype.requireObject = function (moduleName, prototypeName, properties) {
        var nom = require(moduleName);
        console.log('Base.requireObject ', arguments);
        return new prototypeName(properties);
    }

    return Base;
});
