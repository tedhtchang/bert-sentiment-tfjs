import * as tf from '@tensorflow/tfjs';

declare global {
  interface Window {
    pageLoaded?: Function;
  }
}

let statusElement: HTMLLabelElement;

class SentimentAnalysis {
  model: tf.GraphModel;

  async load(){
    this.model = await tf.loadGraphModel('/model/model.json');
    console.log(this.model.inputNodes);
    console.log(this.model.outputNodes);
  }

  async analyzeSentence(){
    return await this._analyze(await this._inputFeature());
  }
  async _analyze(feature: tf.NamedTensorMap){
    return tf.tidy(() => {
      let pred: tf.Tensor = this.model.predict({...feature}) as tf.Tensor;
      return pred.squeeze([0]);
    });
  }

  async _tokenization(example: string){
  }

  async _inputFeature(){
    let feature: tf.Tensor;
    //Hard code "i like strawberries"
    let input_ids_1 = tf.tensor1d([101, 1045, 2066, 13137, 20968, 102, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],'int32').expandDims(0);
    let input_mask_1 = tf.tensor1d([1 ,1 ,1 ,1 ,1 ,1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],'int32').expandDims(0);
    let segment_ids_1 = tf.tensor1d([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 'int32').expandDims(0);
    return {input_ids_1, segment_ids_1, input_mask_1};
  }
}

async function pageLoaded() {
  let start = Date.now();
  await measureElapsedTime('loading model', async () => {
    await loadModel();
  });
  await measureElapsedTime('predict', async () => {
    await predict();
  });
}

async function measureElapsedTime(task: string, func: Function) {
  const start = Date.now();
  await func();
  console.log(`${task}: ${Date.now() - start}`);
}
const sa = new SentimentAnalysis();

async function loadModel() {
  updateStatus('loading bert model.....');
  await sa.load();
  updateStatus('bert model loaded!');
}

async function predict() {
  updateStatus('preidcting');
  let result = await sa.analyzeSentence();
  console.log(JSON.stringify(result.arraySync(), null, 2));
  updateStatus(`result:${result.arraySync()}`);
  result.dispose();
}

function updateStatus(msg: string) {
  if (!statusElement) {
    statusElement = document.getElementById('status') as HTMLLabelElement;
  }
  statusElement.innerHTML = msg;
}

window.pageLoaded = pageLoaded;

