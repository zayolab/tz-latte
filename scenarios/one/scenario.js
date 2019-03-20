module.exports = async function scenario({ val1, val2, numObjects }) {
    return new Promise(async (resolve, reject) => {
        console.log(`Scenario One: ${numObjects}`);
        console.log(`Val1: ${val1}`);
        console.log(`Val2: ${val2}`);
        let stats = {
            'Number of Objects': numObjects,
            'Number of Buckets': 1,
            'Time to Load': 1,
            'Time to Read': 1,
            'Time to Purge': 1,
            'Memory Used': 1
        };
        resolve(stats);
    });
};
