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

* [sentiment_BERT_base_uncased](s3.us-south.cloud-object-storage.appdomain.cloud/max-assets-prod/max-text-sentiment-classifier/1.0.0/assets.tar.gz): Download and untar

* Place /model folder under public directory

### How to run this app
1. npm run dev
2. Open http://localhost:3000 in browser
3. Open web console in browser to see output which should look like:
   ```
   loading model: 3666
   [
   0.5241742134094238,
   0.4758257567882538
   ]
   predict: 2085
   ```
### Convert vocab.txt to vocab.json
*
   ```
   cd src/util
   python txt2json-1.py
   # Then replace all "_ with "▁
   # This is a U+2581 unicode
   # for "lower one eighth block" character
   ```
*  Work in progress
```
# This is supposedly to generate the
# U+2581 char during conversion but
# USE does not generate the corrected
# tokens
cd src/util
python txt2json.py

```
### Run USE tokenizer in debugger in vscode
1. Open bert-sentiment-tfjs repo in vscode
2. Click debug icon on left-hand side vertical tool bar
3. Click on play buttom on the top to run the program
4. See debug console for output
