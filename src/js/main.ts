import * as tf from '@tensorflow/tfjs';
import WordPieceTokenizer from './tokenization';

declare global {
  interface Window {
    pageLoaded?: Function;
  }
}

let statusElement: HTMLLabelElement;

class SentimentAnalysis {
  private model: tf.GraphModel;
  private tokenizer: WordPieceTokenizer;
  constructor(){
    this.tokenizer = new WordPieceTokenizer(true);
  }

  async load(){
    await this.tokenizer.init('http://localhost:3000/vocab.json');
    this.model = await tf.loadGraphModel('/model/model.json');
  }

  async analyzeSentence(text: string){
    return await this.analyze(await this.inputFeature(text));
  }

  analyze(feature: tf.NamedTensorMap){
    return tf.tidy(() => {
      let pred: tf.Tensor = this.model.execute({...feature}, 'loss/Softmax') as tf.Tensor;
      return pred.squeeze([0]);
    });
  }

  async inputFeature(text: string){
    const singleInput = await this.convertSingleExample(text);
    let inputIds = tf.tensor1d(singleInput.inputIds, 'int32').expandDims(0);
    let inputMask = tf.tensor1d(singleInput.inputMask, 'int32').expandDims(0);
    let segmentIds = tf.tensor1d(singleInput.segmentIds, 'int32').expandDims(0);
    return {"input_ids_1": inputIds, "input_mask_1": inputMask, "segment_ids_1": segmentIds};
  }

  async convertSingleExample(text: string){
    // converts single example to feature input. This is derived from:
    // https://github.com/google-research/bert/blob/88a817c37f788702a363ff935fd173b6dc6ac0d6/run_classifier.py#L377-L476

    let inputIds: number[] = [];
    let inputMask: number[] = [];
    let segmentIds: number[] = [];
    const tokenIds = await this.tokenizer.tokenize(text);
    const maxSeqLength = 128;

    inputIds.push(this.tokenizer.clsId)
    inputMask.push(1);
    segmentIds.push(0);

    inputIds.push(...tokenIds);
    tokenIds.forEach(id => {
      inputMask.push(1);
      segmentIds.push(0);
    });

    inputIds.push(this.tokenizer.sepId)
    inputMask.push(1);
    segmentIds.push(0);

    // pad with 0 up to the maxSeqLength
    const numTokens = inputIds.length
    for (let i = 0; i < maxSeqLength - numTokens; i++){
      inputIds.push(0);
      inputMask.push(0);
      segmentIds.push(0);
    }
    console.log('input_ids: ', inputIds);
    console.log('input_mask: ', inputMask);
    console.log('segmentIds: ', segmentIds);
    console.log('tokens: ', this.tokenizer.convertIdsToTokens(inputIds));
    return {inputIds, segmentIds, inputMask};
  }
}

async function pageLoaded() {
  await measureElapsedTime('Model Loading time (ms)', async () => {
    await loadModel();
  });
  document.getElementById("div1").style.display = "block";
  document.getElementById("submit_text").addEventListener("click",
    event => {
      event.preventDefault();
      let text = (<HTMLInputElement>document.getElementById("text_input")).value
      textSubmit(text);
    }
  )
}

async function textSubmit(text: string) {
  await measureElapsedTime('Prediction time (ms)', async () => {
    await predict(text);
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

async function predict(text: string) {
  updateStatus('preidcting');
  const result = await sa.analyzeSentence(text);
  console.log(JSON.stringify(result.arraySync(), null, 2));
  const res = result.arraySync() as number[];
  updateStatus(`<br />Positive &#128512;: ${res[0].toFixed(4)}<br />Negative &#128534;: ${res[1].toFixed(4)}`);
  result.dispose();
}

function updateStatus(msg: string) {
  if (!statusElement) {
    statusElement = document.getElementById('status') as HTMLLabelElement;
  }
  statusElement.innerHTML = msg;
}
window.pageLoaded = pageLoaded;

