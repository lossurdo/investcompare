var express = require('express');
var app = express();
var cheerio = require('cheerio');
var request = require('request');

app.use(express.static('public'));
app.use('/node_modules', express.static('node_modules'));

app.get('/indices/selic', function (req, res) {

    request('https://www.melhorcambio.com/taxa-selic', function (error, response, body) {
        console.log('statusCode:', response && response.statusCode);
        const $ = cheerio.load(body);        
        var v = $("#snipet-div > table > tbody > tr:nth-child(4) > td.tdvalor").text();
        res.send(v.replace(',','.').replace('%',''));
    });

});

app.get('/indices/ipca', function (req, res) {

    request('https://www.portalbrasil.net/ipca/', function (error, response, body) {
        console.log('statusCode:', response && response.statusCode);
        const $ = cheerio.load(body);
        var v = $(".fd17 > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(4)").text();
        res.send(v.replace(',','.'));
    });

});

app.get('/indices/poupanca', function (req, res) {

    request('https://www.portalbrasil.net/rendimentos-da-caderneta-de-poupanca-mensal-2022/', function (error, response, body) {
        console.log('statusCode:', response && response.statusCode);
        const $ = cheerio.load(body);
        var v = $("#tb > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(2)").text();
        res.send(v.replace(',','.'));
    });

});

app.get('/indices/cdi', function (req, res) {

    request('https://www.melhorcambio.com/taxa-selic', function (error, response, body) {
        console.log('statusCode:', response && response.statusCode);
        const $ = cheerio.load(body);        
        var v = $("#snipet-div > table > tbody > tr:nth-child(4) > td.tdvalor").text();
        res.send(v.replace(',','.').replace('%',''));
    });

});

const _PORT = 9000;
app.listen(_PORT, function () {
    console.log('Ok!', _PORT);
});
