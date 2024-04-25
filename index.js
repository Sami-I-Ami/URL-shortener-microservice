require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const bodyParser = require('body-parser');
const { sendStatus } = require('express/lib/response');
const { hostname } = require('os');
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

// URL shortener post
app.post('/api/shorturl/',
  function(req, res, next) {
    // make sure url exists
    req.invalid = false;
    const urlRegex = /^https:\/\/www\.[A-Za-z0-9]+\.com$/;
    if (urlRegex.test(req.body.url)) {
      req.hostslice = req.body.url.slice(req.body.url.indexOf('w'));
      dns.lookup(req.hostslice, function(err) {
        if (err) {
          req.invalid = true;
        }
      });
    } else {
      req.invalid = true;
    }
    next();
  }, function (req, res) {
    // output
    if (req.invalid) {
      res.json({error: 'invalid url'});
    } else {
      // add to url array
      position = urls.push(req.body.url);
      res.json({
        original_url: req.body.url,
        short_url: position
      });
    }
  }
)

// URL shortener get
app.get('/api/shorturl/:shorturl', function(req, res) {
  urlToGet = urls[req.params.shorturl - 1];
  if (urlToGet) {
    res.status(301).redirect(urlToGet);
  } else {
    res.json({error: "short url doesn't exist"})
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
