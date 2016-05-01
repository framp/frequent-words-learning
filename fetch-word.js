const Promise = require('bluebird')
const request = require('request')
const { load: parseHtml } = require('cheerio')
const { createWriteStream: file, open } = require('fs')
const debug = require('debug')('frequent-words-learning:fetch')

const baseUrl = 'http://dictionary.cambridge.org/pronunciation/english/'
const prefix = './words/'
const extension = 'mp3'

module.exports = (word) => 
  fileMissing(`${prefix}${word}.${extension}`, () =>
    promiseRequest(`${baseUrl}${word}`)
      .then(parseHtml)
      .then(apply('div.sound.big-pron-uk'))
      .then(pipe(access(0), access('attribs'), access(`data-src-${extension}`)))
      .then(log(`Download ${word}: `))
      .then(request)
      .then(streamTo(file(`${prefix}${word}.${extension}`)))
      .catch(log(`Error ${word}: `)))

const apply = (...a) => (b) => b(...a)
const access = (a) => (b) => b[a]
const pipe = (...fns) => (...args) => fns.reduce((res, fn) => [fn(...res)], args)[0]
const log = (a) => (b) => debug(a, '\n', b) || b

const streamTo = (to) => (from) => 
  new Promise((resolve, reject) => {
    const stream = from.pipe(to);
    stream.on('finish', resolve)
    stream.on('error', reject)
  })
const promiseRequest = (url, chunks = [], stream = request(url)) => 
  new Promise((resolve, reject) => {
    stream.on('data', chunks.push.bind(chunks))
    stream.on('end', () => resolve(chunks.join('')))
    stream.on('error', reject)
  })
const fileMissing = (file, fn) =>
  new Promise((resolve, reject) => {
    try {
      open(file, 'r', (err) => resolve(err ? fn() : 'Already downloaded'))
    } catch(e) { 
      resolve(fn())
    }
  })