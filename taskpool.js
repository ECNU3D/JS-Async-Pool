console.log(`begin`);

main();

function main() {
    var pool = new TaskPool();
    for(let i of [...Array(20).keys()]) {
        console.log(`submit task ${i}`);
        pool.submit(
            function() {
                return fackAsyncFindContact(i)
                .then(() => `found ${i}!`);
            }
        );
    }
}

function fackAsyncFindContact(id) {
    return new Promise(function(resolve, reject) {
        let timeout = Math.ceil(Math.random() * 5000);
        setTimeout(()=> {
            if(timeout % 13 === 0)  {
                reject(`deliberate reject by imitating a condition check: ${timeout} % 13 === ${timeout%13}`);
            }
            else {
                resolve(`async find contact success with id ${id}`);
            }
        }, timeout);
    });
}

function TaskPool() {   
    var MAX = 5;
    var QUEUE = [];
    var current = 0; 
    TaskPool.prototype.submit = submit;

    function submit(func) {
        if ( typeof func !== 'function' ) {
            throw new Error(`${func} is not a function. Please verify your input.`);
        } 
        QUEUE.push(func);
        executeAll();
    }

    function executeAll() {
        if (current >= MAX) {
            console.log('Taskpool executors number limit reached, yield...');
            return;
        }
        if (QUEUE.length === 0) {
            console.log('WORK QUEUE is drained. Executor is stopping');
            return;
        }
        let func = QUEUE.shift();
        let promise = func();
        if (!promise || !promise.then) {
            promise = Promise.reject('Task sumbitted is not returning a promise.');
        }
        current++;
        promise
        .then( (msg) => console.log(`task finished: ${msg}`) )
        .catch( (msg) => console.error(`caught an error: ${msg}`) )
        .then( () => current-- )
        .then( () => setTimeout(executeAll.bind(this), 100) );

    }    
}
