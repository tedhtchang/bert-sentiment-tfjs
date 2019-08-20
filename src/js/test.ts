import WordPieceTokenizer from './tokenization';

let tok = new WordPieceTokenizer('http://localhost:3000/vocab-1.json', true)

async function tokenize(text: string){
  const ids = await tok.tokenize(text);
  const Tokens = tok.convertIdsToTokens(ids);
  console.log('Text :', text);
  console.log('Token IDs :', ids);
  console.log('Tokens :', Tokens);
}

tokenize("I like strawberries?");
tokenize("Like strawberries??maybe.");
tokenize("strawberries?No. Thank you!");
