const tf = require('@tensorflow/tfjs');
const fs = require('fs');

//BERT Base model
//Run a specified operation, i.e. "loss/Softmax" with an input object.
(async ()=>{
// const model = await tf.loadGraphModel('http://localhost:3000/model/model.json'); //var
const model = await tf.loadGraphModel('http://localhost:3000/model/model.json'); //var

const MAX_INPUT_LENGTH = 15; // Novel input lengths force recompilation which slows down inference, so it's a good idea to enforce a max length.

// This is the tokenization of '[CLS] Hello, my dog is cute. [SEP]'.
const input_ids = tf.tensor1d(
    [101, 7592, 1010, 2026, 3899, 2003, 10140, 1012, 102, 0, 0, 0, 0, 0, 0], 'int32').pad([[0,128-MAX_INPUT_LENGTH]]).expandDims();

const segment_ids = tf.tensor1d(
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 'int32').pad([[0, 128 - MAX_INPUT_LENGTH]]).expandDims();

const input_mask = tf.tensor1d(
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0], 'int32').pad([[0, 128 - MAX_INPUT_LENGTH]]).expandDims(0);

const [sequence_output, pooled_output] = await model.execute({'segment_ids': segment_ids, 'input_ids': input_ids, 'input_mask': input_mask},
                                                            ['module_apply_tokens/bert/encoder/layer_11/output/LayerNorm/batchnorm/add_1', 'module_apply_tokens/bert/pooler/dense/Tanh']); //var
// const [sequence_output, pooled_output] = await model.execute({'segment_ids_1': segment_ids, 'input_ids_1': input_ids, 'input_mask_1': input_mask},
// ['bert/encoder/layer_11/output/LayerNorm/batchnorm/add_1', 'bert/pooler/dense/Tanh']);
writeToFile("./sequence_output_bert_base_tfjs-ann.txt", JSON.stringify(sequence_output.arraySync()));
writeToFile("./pooled_output_bert_base_tfjs-ann.txt", JSON.stringify(pooled_output.arraySync()))
function writeToFile(fn, output){
    fs.writeFile(fn, output, (err) => {
        if (err) throw err;
    });
    console.log("Wrote to: ", fn);
}
})()

