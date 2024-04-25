require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// URL array
urls = [];

// URL shortener endpoint
app.route('/api/shorturl/').post(function (req, res) {
  // add to url array
  position = urls.push(req.body.url);
  
  // output
  res.json({
    original_url: req.body.url,
    short_url: position
  })
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
