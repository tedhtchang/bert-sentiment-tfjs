import SentimentAnalysis from './sentimentanalysis';

declare global {
  interface Window {
    pageLoaded?: Function;
  }
}

let statusElement: HTMLLabelElement;


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
  updateStatus('predicting');
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

