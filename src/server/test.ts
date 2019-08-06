import * as use from '@tensorflow-models/universal-sentence-encoder';

use.loadTokenizer('http://localhost:3000/vocab.json').then(tokenizer => {
  console.log( tokenizer.encode("i"));
});
