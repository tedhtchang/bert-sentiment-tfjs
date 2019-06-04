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
    this.model = await tf.loadGraphModel('/model/model.json')
  }

  async analyzeSentence(string: string){

  }
  async _analyze(feature: tf.Tensor){

  }

  async _tokenization(example: string){

  }
}

async function pageLoaded() {
  let start = Date.now();
  await measureElapsedTime('loading model', async () => {
    await loadModel();
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

function updateStatus(msg: string) {
  if (!statusElement) {
    statusElement = document.getElementById('status') as HTMLLabelElement;
  }
  statusElement.innerHTML = msg;
}

window.pageLoaded = pageLoaded;
