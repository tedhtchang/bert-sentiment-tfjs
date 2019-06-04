import * as express from 'express';
import * as path from 'path';

const app = express();
const port = process.env.PORT || 3000; // default port to listen

app.use(express.static(path.join(__dirname, '../', 'public')))

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
