import React from 'react';

import express from 'express';
const app = express();
const port = 3000;
import App from './components/App';
import ReactDOMServer from 'react-dom/server';

console.log(ReactDOMServer.renderToString(<App />));

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`server listening on port ${port}`));
