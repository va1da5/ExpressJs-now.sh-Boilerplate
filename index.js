const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;


function log_request(req){
    let headers = req.headers;
    let out = `Date: ${(new Date()).toISOString()}\n`;
    out += `URL: ${req.protocol + '://' + req.get('Host') + req.url}\n`;
    out += `User-Agent: ${headers['user-agent']}\n`;
    out += `Referer: ${headers.referer}\n`;
    out += `Cookies: ${headers.cookies}\n`;
    out += `\n`
    out += JSON.stringify(headers);
    console.log(out);
}


app.get("/xss.js", (req, res) => {
    let file = path.join(__dirname + "/files/xss.js");
    fs.readFile(file, (err, data) => {
        if (err) throw err;
        if (req.query.value && req.query.value.length)
            data = data.toString().replace("999", req.query.value);
        log_request(req);
        res.set({"Content-Type": "application/javascript"});
        res.send(data);
    });
});


app.get("/xxe.xml", (req, res) => {
    log_request(req);
    let file = path.join(__dirname + "/files/xxe.xml");
    res.set({"Content-Type": "application/xml"});
    res.sendFile(file);
});


app.listen(port, () => console.log(`App listening on port ${port}!`))