'use strict';

module.exports = {
    now: () => new Date(),
    yesterday: () => {
        let y = new Date();
        y.setDate(y.getDate() - 1);
        return y;
    }
};