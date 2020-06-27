const fs = require('fs');

fs.readFile('system.dic', (err: any, content: ArrayBuffer) => {
    if (err) {
        console.error(err);
    }

    let buf = Buffer.from(content);
    let offset = 0;

    // header
    const version = buf.readBigUInt64LE(offset);
    offset += 8;
    const createTime = buf.readBigInt64LE(offset);
    offset += 8;

    const description_size = 256;
    const description = buf.toString('utf8', offset, offset + description_size);
    offset += description_size * 8;

    console.log(`version: 0x${version.toString(16)}`);
    console.log(`create time: ${createTime}`);
    console.log(`description: ${description}`);
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
