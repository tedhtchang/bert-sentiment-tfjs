# bert-sentiment-tfjs
Sentiment Analysis using BERT model and Tensorflowjs
## Instruction:

1. Run ```npm install``` first to install the required modules.
2. Run ```npm run dev``` to run to start the server.

### Run analysis directly on browser (GPU)
Open http://localhost:3000 in browser. Open web console in browser to see output which should look like:
   ```
   Loaded Tokenizer.
   105 Model Loading time (ms): 4941
   ```
### Run analysis from the server side
Open http://localhost:3000/server.html in your browser.

### Convert vocab.txt to vocab.json (optional)
* An included vocabulary file, vocab.json, is extracted and converted from "[Bert-base, uncase](https://github.com/google-research/bert#pre-trained-models)". If you would like to convert other pre-trained vocabularies use the following example:
*  ```
   cd src/util
   python txt2json.py ../../public/vocab.txt /tmp/vocab.json
   ```
### Run Debugger for Chrome in vscode (optional)
1. Install the debugger from [here](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
2. Open the debugger in VSCode.
3. Set break points in the source code (*.ts).
4. Clicking on the "Start Debugging" button will launch the Chrome browser using the configuration in launch.json.
