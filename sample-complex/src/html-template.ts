const x = (appMarkup: string, initialState: string) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>Empty project</title>
    <meta charset="utf-8" />
    <link href="https://unpkg.com/tailwindcss/dist/tailwind.min.css" rel="stylesheet">

  </head>
  <body>
    <script>
      window.__initialState = ${initialState}
    </script>
    <div id="app">${appMarkup}</div>
    <script src="dist/client.js"></script>
  </body>
</html>`;
};

export default x;
