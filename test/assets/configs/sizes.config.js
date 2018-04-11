'use strict';

const min = {
    height: 768,
    width: 1024
};

module.exports = {
    min,
    minGeometry: () => {
        return `${min.width}x${min.height}`;
    }
};
