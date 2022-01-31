const read = require('fs')
const file = read.readFileSync('words.txt', 'utf-8')
const breakingFile = (contentFile) => (contentFile
					.toLowerCase()
					.replace(/['!"¡#$%&\\'()\*+,\-–\.\/:;<=>?@\[\\\]\^_`{|}~'\n]/g, '')
					.split(' ')) 

const duplicateWords = (words) => {
	let objWords = {}
	words.forEach((word) => objWords[word] ??= 1 );
	return Object.keys(objWords)
}

const splitFile = duplicateWords(breakingFile(file))
console.log(splitFile)