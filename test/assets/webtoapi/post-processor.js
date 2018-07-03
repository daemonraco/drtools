'use strict';

module.exports = data => {
    let results = JSON.parse(JSON.stringify(data));

    results.totalFruits = 0;
    if (results.fruits && Array.isArray(results.fruits)) {
        for (const fruit of results.fruits) {
            fruit.count = parseInt(fruit.count);
            results.totalFruits += fruit.count;
        }
    }

    return results;
}
