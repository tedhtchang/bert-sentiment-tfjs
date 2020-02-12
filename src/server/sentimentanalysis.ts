import * as tf from '@tensorflow/tfjs-node';
import WordPieceTokenizer from './tokenization';
import path from 'path';
import fs from 'fs';
import {IORouter} from '@tensorflow/tfjs-core/dist/io/router_registry';

const modelJsonUrl = 'https://s3.us-south.cloud-object-storage.appdomain.cloud/max-assets-prod/max-text-sentiment-classifier/tfjs/0.1.0/model.json'

export default class SentimentAnalysis {
  private model: tf.GraphModel;
  private tokenizer: WordPieceTokenizer;
  constructor(){
    this.tokenizer = new WordPieceTokenizer(true);
  }

  async load(){
    await this.tokenizer.init('https://s3.us-south.cloud-object-storage.appdomain.cloud/max-assets-prod/max-text-sentiment-classifier/tfjs/0.1.0/vocab.json');
    const modelDir = path.join(`${__dirname}`, '..', '..', '/public/model');
    const modelJson = path.join(modelDir, '/model.json');
    if( ! fs.existsSync(modelJson)){
      tf.io.registerLoadRouter(tf.io.http as IORouter);
      console.log("Downloading model from " + modelJsonUrl + ' to ' + 'file://' + modelDir);
      await tf.io.copyModel(modelJsonUrl, 'file://' + modelDir);
    }
    const fileSystem = require('@tensorflow/tfjs-node/dist/io/file_system');
    this.model = await tf.loadGraphModel(fileSystem.fileSystem(modelJson));

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
