const express = require('express');
const http = require('http');
const request = require('request');

const app = express();
const port = 3000;

function errorHandler(err, req, res, next) {
    res.send('error');
}

app.get('/*', (req, res) => {
    console.log(req.originalUrl);
    const isBlocked = req.originalUrl.includes("bbc");

    if(isBlocked) {
        return res.send('Blocked');
    }

    return request(req.originalUrl)
        .on('error', function(err) { return res.end('error'); })
        .pipe(res);
});

app.use(errorHandler);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
