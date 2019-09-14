tf = require('@tensorflow/tfjs')

const x = tf.tensor1d([-3, -1, 0.0,0.5,2.1], dtype='float32');
x.erf().print();
