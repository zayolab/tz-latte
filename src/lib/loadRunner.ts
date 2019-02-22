// This module runs a remote callback method

async function loadRunner(message: any) {
    return new Promise (async (resolve, reject) => {
        try {
            let result = await message.callback(message.payload);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

process.on('message', (message) => {
    console.log(`In subprocess: ${process.pid}`);
    console.log('Child got message from parent!');
    console.log(message);
    // let result = loadRunner(message);
    process.send({result: 'result'}); // Send the result back to the parent.
});

