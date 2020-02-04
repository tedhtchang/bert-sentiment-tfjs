import express from 'express';
import * as path from 'path';
import * as sa from './main';

const app = express();
const port = process.env.PORT || 3000; // default port to listen
sa.loadModel().then(()=>console.log("Model loaded."));

app.use(express.static(path.join(__dirname, '..', '..', 'public')))
app.get('/predict', (req, res) => {
    const textInput = req.param('text_input', '');
    console.log('Text:' + textInput);
    sa.predict(textInput).then((ans)=>{res.send(ans);});
});

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }`);
} );
