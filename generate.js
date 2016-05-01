const { readFileSync, writeFileSync, openSync } = require('fs')

const filename = 'frequent-words.txt'

const repeat = (length, a) => Array.apply(null, {length}).map(() => a, String)
const repeatedPath = (a) => repeat(10, `words/${a}.mp3`).join('\n')
const fileExists = (file, fn) => {
  try {
    openSync(file, 'r')
    return fn()
  } catch(e) { 
    console.log('MISSING: ', file)
    return ''
  }
}

const words = readFileSync(filename, 'utf8').split('\n').filter((a) => a)
const files = words.map((a) => fileExists(`words/${a}.mp3`, repeatedPath.bind(0, a)))
writeFileSync('playlist.m3u', files.join('\n'))