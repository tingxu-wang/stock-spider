/*
* 获取所有股票代码
* */

const cheerio = require('cheerio'),
	request = require('request'),
	fs = require('fs'),
	stockListUrl = require('../config').stockListUrl;

request.get(stockListUrl,function(err,res,body){
	if(err){
		console.log(err)
		return;
	}

	const $ = cheerio.load(body);
	const $a = $('.quotebody #quotesearch li a[href]');
	let length = $a.length,
		stockCodeList = [];

	for(let i = 0;i < length;i++){
		const href = $a[i].attribs.href;
		const code = /\.com\/([a-z\d]+).html/.exec(href)[1];

		stockCodeList.push(code);
	}

	const writeStream = fs.createWriteStream('../data/stock-code.json');

	writeStream.write(JSON.stringify(stockCodeList));
	writeStream.end(()=>{
		console.log('stock list write finished')
	})
});