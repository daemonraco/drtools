'use strict';

module.exports = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log(`Promise loader... loaded`);
        resolve();
    }, 1000);
});
