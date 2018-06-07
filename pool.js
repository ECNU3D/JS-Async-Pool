console.log(`begin`);

function fackAsyncFindContact(id) {
    // console.log(`calling fackAsyncFindContact with id ${id}`);
    return new Promise(function(resolve) {
        setTimeout(()=> {
            resolve(id);
            console.log(`fackAsyncFindContact finished with id ${id}`);
        }, 1500);
    });
}

function main() {
    var pool = new Pool();
    for(let i of [...Array(30).keys()]) {
        console.log(`submit with ${i}`);
        // fackAsyncFindContact(i).then(() => console.log('then called')).then(() => `found ${i}!`);
        pool.submit(
            function() {
                return fackAsyncFindContact(i)
                .then(() => `found ${i}!`);
            }
        );
    }
}

function Pool() {
    // var MAX = 5;
    // var QUEUE = [];
    // var current = 0;
    // var STATUS = 'OPEN';
    
    Pool.prototype.submit = submit;
    Pool.prototype.MAX = 5;
    Pool.prototype.QUEUE = [];
    Pool.prototype.current = 0;
    Pool.prototype.executeAll = executeAll;

    function submit(func) {
        this.QUEUE.push(func);
        // STATUS = 'OPEN';
        this.executeAll();
    }

    function executeAll() {
        // console.log(`Current thread is ${this.current}, MAX is ${this.MAX}`);
        if(this.current >= this.MAX) {
            console.log('Pool max reached, retured and wait other to pick it up later');
           return;
        }
        let func = this.QUEUE.shift();

        if(func) {
            this.current++;
            func()
            .then((msg) => console.log(`pool task done with msg: ${msg}`))
            .then(() => this.current--)
            .then(() => setTimeout(executeAll.bind(this), 1000));
        } else {
            // setTimeout(executeAll.bind(pool), 1000);
        }
    }

    
}

// function creatTask(f, args) {
//     var cb = f.bind(this);
//     return new Promise((resolve) => {
//         cb(args).then();

//     });
// }

main();