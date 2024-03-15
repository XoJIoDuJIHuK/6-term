const fs = require('fs')
const { performance } = require('perf_hooks');

const alphabet = "abcdefghijklmnopqrstuvwxyz"
const N = alphabet.length
const a = 3
const b = 5
const keyword = 'sequrity'
const table = [
    'sequrityabcdf',
    'ghjklmnopvwxz'
]

function getTritemiusCoordinates(letter) {
    let indexX, indexY
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[0].length; j++) {
            if (table[i][j] === letter) {
                indexY = i
                indexX = j
                break
            }
        }
    }
    return [indexY, indexX]
}
function decipherTritemiusLetter(letter) {
    let [indexY, indexX] = getTritemiusCoordinates(letter)
    if (indexY === 0) {
        indexY = table.length - 1
    } else {
        indexY--
    }
    return table[indexY][indexX]
}
function cipherTritemiusLetter(letter) {
    let [indexY, indexX] = getTritemiusCoordinates(letter)
    if (indexY === table.length - 1) {
        indexY = 0
    } else {
        indexY++
    }
    return table[indexY][indexX]
}

function cipherCaesar(message) {
    return message.toLowerCase().split('').map(cipherCaesarLetter).join('').toUpperCase()
}
function decipherCaesar(message) {
    return message.toLowerCase().split('').map(decipherCaesarLetter).join('').toUpperCase()
}

function cipherTritemius(message) {
    return message.toLowerCase().split('').map(cipherTritemiusLetter).join('').toUpperCase()
}
function decipherTritemius(message) {
    return message.toLowerCase().split('').map(decipherTritemiusLetter).join('').toUpperCase()
}
function cipherCaesarLetter(letter) {
    const x = alphabet.indexOf(letter)
    return alphabet[(a * x + b) % N]
}
function decipherCaesarLetter(letter) {
    const inverseA = findInverse();
    const cipheredIndex = alphabet.indexOf(letter)
    const decryptedIndex = (inverseA * (cipheredIndex - b + N)) % N
    return alphabet[decryptedIndex]
}
function findInverse() {
    for (let i = 1; i < N; i++) {
        if ((a * i) % N === 1) {
            return i
        }
    }
}

function getFrequencies(message) {
    const frequencies = {}
    for (let char of message) {
        if (frequencies[char]) {
            frequencies[char]++
        } else {
            frequencies[char] = 1
        }
    }
    return frequencies
}
function buildHistogram(message) {
    const frequencies = getFrequencies(message.toLowerCase())
    const maxValue = Math.max(...Object.values(frequencies))
    console.log('max: ', maxValue)
    const height = 10
    for (let i = 0; i < height; i++) {
        console.log(i, ' ', alphabet.split('').map(char => (frequencies[char] > maxValue * (1 - (i + 1) / height)) ? '#' : ' ').join(''))
    }
    console.log('  ', alphabet)
}


const text = String(fs.readFileSync('text.txt'))
console.log('Caesar')
let t1, t2, delta
t1 = performance.now()
const cipheredCaesar = cipherCaesar(text)
t2 = performance.now()
delta = t2 - t1
console.log('cipher caesar time: ', delta)
t1 = performance.now()
const decipheredCaesar = decipherCaesar(cipheredCaesar)
t2 = performance.now()
delta = t2 - t1
console.log('decipher caesar time: ', delta)
console.log(cipheredCaesar)
console.log(decipheredCaesar)
buildHistogram(cipheredCaesar)
buildHistogram(decipheredCaesar)

console.log('Tritemius')
t1 = performance.now()
const cipheredTritemius = cipherTritemius('QWERTY')
t2 = performance.now()
delta = t2 - t1
console.log('cipher tritemius time: ', delta)
t1 = performance.now()
const decipheredTritemius = decipherTritemius(cipheredTritemius)
t2 = performance.now()
delta = t2 - t1
console.log('decipher tritemius time: ', delta)
console.log(cipheredTritemius)
console.log(decipheredTritemius)
buildHistogram(cipheredTritemius)
buildHistogram(decipheredTritemius)