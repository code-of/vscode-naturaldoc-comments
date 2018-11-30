#!/usr/bin/env node
'use strict';
const cmt = require('./ndcomment');
const process = require('process');
const fs = require('fs');

let err = new Error('no matchdata');
let fileString = new String();
fileString = fs.readFileSync(process.argv[2], 'utf8');
let comment = new cmt.DocBuilder(fileString);
console.log(comment.getDocComment());