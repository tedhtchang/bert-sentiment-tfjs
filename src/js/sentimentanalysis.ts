import * as tf from '@tensorflow/tfjs';
import WordPieceTokenizer from './tokenization';

export default class SentimentAnalysis {
  private model: tf.GraphModel;
  private tokenizer: WordPieceTokenizer;
  constructor(){
    this.tokenizer = new WordPieceTokenizer(true);
  }

  async load(){
    await this.tokenizer.init('https://s3.us-south.cloud-object-storage.appdomain.cloud/max-assets-prod/max-text-sentiment-classifier/tfjs/0.1.0/vocab.json');
    this.model = await tf.loadGraphModel('https://s3.us-south.cloud-object-storage.appdomain.cloud/max-assets-prod/max-text-sentiment-classifier/tfjs/0.1.0/model.json');
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
