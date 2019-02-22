module.exports = async function scenario({ numObjects }) {
    return new Promise(async (resolve, reject) => {
        console.log(`Scenario Two: ${numObjects}`);
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
