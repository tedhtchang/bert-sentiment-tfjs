import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as punctuations from 'unicode-12.1.0/General_Category/Punctuation/code-points';
import * as nsmarks from 'unicode-12.1.0/General_Category/Nonspacing_Mark/code-points';
import * as ctlchar from 'unicode-12.1.0/General_Category/Control/code-points';
import * as spcsep from 'unicode-12.1.0/General_Category/Space_Separator/code-points';

function isPunctuation(cp: number):boolean {
  // Checks a cp is a punctuation character or not.
  return (punctuations.indexOf(cp) !== -1);
}

function runStripAccents(text: string){
  // strips accent marks from text
  text = text.normalize("NFD");
  nsmarks.forEach((cp: number) => {text = text.replace(String.fromCodePoint(cp), "")});
  return text;
}

function isWhiteSpace(cp: number): boolean{
  // \t, \n, and \r are technically contorl characters but we treat them
  // as whitespace since they are generally considered as such.
  if (cp === 32 || cp === 9 || cp === 10 || cp === 13) {
    return true;
  }
  if (spcsep.indexOf(cp) != -1){
    return true;
  }
  return false;
}

function isControl(cp: number): boolean{
  // "\t" "\n" "\r" are technically control characters but we count them as whitespace
  // characters.
  if (ctlchar.indexOf(cp) !== -1 && cp !== 9 && cp !== 10 && cp !== 13){
    return true;
  }
  return false;
}

function runSplitOnPunctuation(text: string){
  // Splits punctuation with a space on a piece of text
  // e.g.:
  // "abc?" -> "abc ?"
  // "abc?def" -> "abc ? def"
  // "abc??def" -> abc ? ? def"
  const output = [];
  let preCodePoint = -1;
  let preCodePointIsPunc = false;
  for (let i = 0; i < text.length; i++){
      // current cp is a punctuation AND previous codePoint is not a space
      // e.g abc?
      const codePoint = text.charCodeAt(i);
      const isPuncCurrent = isPunctuation(codePoint);
      if (isPuncCurrent && preCodePoint !== 32) {
        output.push(32);
        // previous cp is not space AND previous codePoint is punctuation
        // e.g. abc??
      } else if (preCodePointIsPunc && codePoint !== 32){
        output.push(32);
      }
      output.push(codePoint);
      preCodePoint = codePoint;
      preCodePointIsPunc = isPuncCurrent;
  }
  return String.fromCodePoint(...output);
}

function cleanText(text: string){
  //Performs invalid character removal and whitespace cleanup on text.
  const output = [];
  for (let i = 0; i < text.length; i++){
    let cp = text.charCodeAt(i);
    if (cp === 0 || cp === 65533 || isControl(cp)){
      continue;
    }
    if (isWhiteSpace(cp)){
      output.push(32);
    }
    else {
      output.push(cp);
    }
  }
  return String.fromCharCode(...output);
}

export default class WordPieceTokenizer{
  //Runs basic tokenization (punctuation splitting, lower casing, etc.).
  private doLowerCase: boolean;
  private pathToVocabulary: string;
  tokenizer: use.Tokenizer;

  constructor(pathToVocabulary: string, doLowerCase: boolean){
    this.doLowerCase = doLowerCase;
    this.pathToVocabulary = pathToVocabulary;
  }

  async tokenize(text: string){
    text = cleanText(text);
    text = runSplitOnPunctuation(text);
    text = runStripAccents(text);
    if (this.doLowerCase){
      text = text.toLowerCase()
    }
    this.tokenizer = await use.loadTokenizer(this.pathToVocabulary);
    return this.tokenizer.encode(text);
  }

  convertIdsToTokens(ids: number[]){
    let tokens: string[] = [];
    ids.forEach( id => {tokens.push(this.tokenizer.vocabulary[id][0])});
    return tokens;
  }
}
