var express = require('express');
var app = express();
var cheerio = require('cheerio');
var request = require('request');

app.use(express.static('public'));
app.use('/node_modules', express.static('node_modules'));

app.get('/indices/selic', function (req, res) {

    request('https://carteirarica.com.br/taxa-selic/', function (error, response, body) {
        console.log('statusCode:', response && response.statusCode);
        const $ = cheerio.load(body);
        var v = $("#anualizada").text();
        res.send(v.replace(',','.'));
    });

});

app.get('/indices/ipca', function (req, res) {

    request('http://www.portalbrasil.net/ipca.htm', function (error, response, body) {
        console.log('statusCode:', response && response.statusCode);
        const $ = cheerio.load(body);
        var v = $("body > div > div:nth-child(9) > table > tbody > tr > td > div > table > tbody > tr:nth-child(2) > td:nth-child(4) > p > font").text();
        res.send(v.replace(',','.'));
    });

});

app.get('/indices/cdi', function (req, res) {

    request('https://carteirarica.com.br/cdi-taxa/', function (error, response, body) {
        console.log('statusCode:', response && response.statusCode);
        const $ = cheerio.load(body);                
        var v = $("#encasulador > div:nth-child(2) > ul > li.price > span").text();
        res.send(v.replace(',','.').replace('%',''));
    });

});




const _PORT = 9000;
app.listen(_PORT, function () {
    console.log('Ok!', _PORT);
});
