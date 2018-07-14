'use strict';

const timer = new Promise((resolve, reject) => setTimeout(resolve, 1000));

module.exports = async () => {
    await timer;
    console.log(`Async loader... loaded`);
}
