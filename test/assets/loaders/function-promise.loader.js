'use strict';

module.exports = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Function->Promise loader... loaded`);
            resolve();
        }, 1000);
    });
}
