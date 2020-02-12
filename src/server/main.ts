import SentimentAnalysis from './sentimentanalysis';

const sa = new SentimentAnalysis();

export async function loadModel() {
  await sa.load();
}

export async function predict(text: string) {
  const result = await (await sa.analyzeSentence(text)).arraySync() as number [];
  return {pos: result[0],
          neg: result[1]        
  };
}
