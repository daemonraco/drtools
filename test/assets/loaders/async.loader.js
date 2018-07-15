'use strict';

const timer = new Promise((resolve, reject) => setTimeout(resolve, 100));

module.exports = async () => {
    await timer;
    console.log(`Async loader... loaded`);
}
