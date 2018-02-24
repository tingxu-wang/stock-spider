/*
* 获取所有股票代码
* */

const cheerio = require('cheerio'),
	iconv = require('iconv-lite'),
	request = require('request'),
	fs = require('fs'),
	stockListUrl = require('../config').stockListUrl;

request.get(stockListUrl,{encoding: null},function(err,res,bodyBuffer){
	if(err){
		console.log(err)
		return;
	}

	const body = iconv.decode(bodyBuffer, 'GBK');

	const $ = cheerio.load(body);
	const $a = $('.quotebody #quotesearch li a[href]');
	let length = $a.length,
		stockCodeList = [];

	for(let i = 0;i < length;i++){
		const data = $a[i].children[0].data;
		const result = /([^\(]+)\((\d+)\)/.exec(data);

		if(result){
			const name = result[1],
				code = result[2];

			if(/^600|601|002|300/.test(code)){ // 筛选个股
				stockCodeList.push({
					name,
					code,
				});
			}
		}
	}

	const writeStream = fs.createWriteStream(`${__dirname}/../data/stock-code.json`);

	writeStream.write(JSON.stringify(stockCodeList));
	writeStream.end(()=>{
		console.log('stock code write finished')
	})
});