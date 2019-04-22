import * as React from 'react';
import * as ReactDOM from 'react-dom/server';
import express from 'express';
import htmlTemplate from './html-template';
import App from './App';
const app = express();

app.use('/dist', express.static(`dist/client`));

app.get('/*', (req, res) => {
  console.log('got a request');
  const markup = ReactDOM.renderToString(<App initialCount={7} />);
  const html = htmlTemplate(markup, JSON.stringify({ initialCount: 7 }));

  res.send(html);
});

const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
