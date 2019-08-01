importScripts(
    'worker_interface.js',
    'LLA.js',
    'Bbox.js',
    'person.js',
    'NavigatingPerson.js',
);

let workProcessor = null;

function start() {
    setInterval(() => {
        workProcessor.step();
    }, 20);
}

onmessage = function(ev) {
    const { data: message } = ev;

    if (message.type === 'init') {
        const initJson = message.initJson;
        workProcessor = new WorkProcessor(initJson, data => {
            postMessage(data);
        });
        start();
    } else if (message.type === 'job') {
        const data = message.data;
        if (workProcessor) {
            workProcessor.beginJob(data);
        }
    }
}