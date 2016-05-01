const Promise = require('bluebird')
const { readFileSync: file } = require('fs')
const fetch = require('./fetch-word')

const filename = 'frequent-words.txt'
const concurrency = 10

const words = file(filename, 'utf8').split('\n').filter((a) => a)
Promise.map(words, fetch, {concurrency}).map(console.log)