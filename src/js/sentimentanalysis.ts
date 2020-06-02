import * as tf from '@tensorflow/tfjs';
import WordPieceTokenizer from './tokenization';

export default class SentimentAnalysis {
  private model: tf.GraphModel;
  private tokenizer: WordPieceTokenizer;
  constructor(){
    this.tokenizer = new WordPieceTokenizer(true);
  }

  async load(){
    await this.tokenizer.init('https://bert-sentiment.s3.us.cloud-object-storage.appdomain.cloud/vocab/vocab.json');
    this.model = await tf.loadGraphModel('https://bert-sentiment.s3.us.cloud-object-storage.appdomain.cloud/model/model.json');
  }

  async analyzeSentence(text: string){
    return this.analyze(await this.tokenizer.inputFeature(text));
  }

  analyze(feature: tf.NamedTensorMap){
    return tf.tidy(() => {
      let pred: tf.Tensor = this.model.execute({...feature}, 'loss/Softmax') as tf.Tensor;
      return pred.squeeze([0]);
    });
  }
}
