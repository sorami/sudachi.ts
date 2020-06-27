import { log } from "console";

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

    const DESCRIPTION_SIZE = 256;
    const description = buf.toString('utf8', offset, offset + DESCRIPTION_SIZE);
    offset += DESCRIPTION_SIZE;

    console.log(`version:\t0x${version.toString(16)}`);
    console.log(`create time:\t${createTime}`);
    console.log(`description:\t${description}`);


    // grammar
    const POS_DEPTH = 6;
    const posSize = buf.readUInt16LE(offset);
    offset += 2;
    for (let i = 0; i < posSize; i++) {
        let pos: string[] = [];
        for (let j = 0; j < POS_DEPTH; j++) {
            const length = buf.readInt8(offset);
            offset += 1;
            const s = buf.toString("utf16le", offset, offset + (2 * length));
            offset += 2 * length;
            pos.push(s);
        }
        // console.log(`${i}:\t${pos}`);
    }

    const leftIdSize = buf.readInt16LE(offset);
    offset += 2;
    const rightIdSize = buf.readInt16LE(offset);
    offset += 2;

    console.log(`pos size:\t${posSize}`);
    console.log(`left id size:\t${leftIdSize}`);
    console.log(`right id size:\t${rightIdSize}`);

    const CONNECT_TABLE_OFFSET = offset;
    // buf.readInt16LE(CONNECT_TABLE_OFFSET + 2 * leftIdSize * leftId + rightId)}`);
    offset += 2 * leftIdSize * rightIdSize;


    // lexicon
    const trieSize = buf.readUInt32LE(offset);
    offset += 4;
    const TRIE_OFFSET = offset;
    // TODO: Trie
    offset += trieSize * 4;
    console.log(`trie size:\t${trieSize}`);

    // word id table
    const wordIdTableSize = buf.readInt32LE(offset);
    offset += 4;
    const WORD_ID_TABLE_OFFSET = offset;
    // TODO: word id table
    offset += wordIdTableSize;
    console.log(`word id table size:\t${wordIdTableSize}`);

    // word params
    const ELEMENT_SIZE = 2 * 3;
    const wordParamsSize = buf.readInt32LE(offset);
    offset += 4;
    console.log(`word params size:\t${wordParamsSize}`);
    const WORD_PARAMS_OFFSET = offset;
    offset += wordParamsSize * ELEMENT_SIZE;

    // word infos
    const WORD_INFOS_OFFSET = offset;

    const wordId = 54321;
    let wordIndex = buf.readInt32LE(WORD_INFOS_OFFSET + 4 * wordId);
    let stringLength = buf.readInt8(wordIndex);
    wordIndex += 1;
    if (stringLength >= 128) {
        stringLength = (stringLength & 0x7F) << 8 | buf.readInt8(wordIndex);
        wordIndex += 1;
    }
    console.log(`${stringLength}`);
    const surface = buf.toString("utf16le", wordIndex, wordIndex + (stringLength * 2));
    console.log(`${surface}`); // word 54321: "くれえ"

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
