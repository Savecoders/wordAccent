// import fs librery
const read = require('fs')
const file = read.readFileSync('words.txt', 'utf-8')
const breakingFile = (contentFile) => (contentFile
					.toLowerCase()
					.replace(/['!"¡#$%&\\'()\*+,\-–\.\/:;<=>?@\[\\\]\^_`{|}~'\n]/g, '')
					.split(' ')) 


const reducerWords = (words) => words.reduce((acc,word) => {
	acc =  word.length >= 4 ? [...acc,word] : acc
	return acc
},[] )

// unique words for file
const uniqueWords = [...new Set(breakingFile(file))] 
const splitFile = reducerWords(uniqueWords)
console.log(splitFile)