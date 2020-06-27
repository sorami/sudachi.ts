const fs = require('fs');

fs.readFile('system.dic', (err, content) => {
    if (err) {
        console.error(err);
    }

    let buf = Buffer.from(content);
    let version = buf.readBigUInt64LE(0);
    let createTime = buf.readBigInt64LE(64);

    console.log(`version: 0x${version.toString(16)}`);
    console.log(`create time: ${createTime}`);
});


// const readline = require('readline');
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// rl.on('line', (line) => {
//   console.log(line);
// }).on('close', () => {
//   process.exit(0);
// });
