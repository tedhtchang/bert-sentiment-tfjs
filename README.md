# bert-sentiment-tfjs
Sentiment Analysis using BERT model and Tensorflowjs
## Instruction:
### Convert to tfjs model format using tensorflowjs_converter v0.8.6
* Run command:
   ```
   tensorflowjs_converter \
   --input_format=tf_saved_model \
   --output_format=tensorflowjs \
   --output_json=1 \
   --output_node_names=loss/Softmax \
   sentiment_BERT_base_uncased
   ./model
   ```

* ./model is the folder to save the converted web friendly model files

* sentiment_BERT_base_uncased: This is the models folder to be converted. [Download](http://s3.us-south.cloud-object-storage.appdomain.cloud/max-assets-prod/max-text-sentiment-classifier/1.0.0/assets.tar.gz) and untar

* Place ./model folder under public directory

### How to run this app
1.
   Run ```npm install``` first to install the required modules.
   Run ```npm run dev``` to run the app for development.

2. Open http://localhost:3000 in browser
3. Open web console in browser to see output which should look like:
   ```
   Loaded Tokenizer.
   105 Model Loading time (ms): 4941
   ```
### Convert vocab.txt to vocab.json
* An included vocabulary file, vocab.json, is extracted and converted from "[Bert-base, uncase](https://github.com/google-research/bert#pre-trained-models)". If you would like to convert other pre-trained vocabularies use the following script:
*  ```
   cd src/util
   python txt2json.py
   ```
### Run Debugger for Chrome in vscode
1. Install the debugger from [here](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
2. Open the debugger in VSCode.
3. Set break points in the source code (*.ts).
4. Clicking on the "Start Debugging" button will launch the Chrome browser using the configuration in launch.json.
