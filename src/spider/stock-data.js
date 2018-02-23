/*
* 根据股票清单获取个股股票信息
* */

const request = require('request'),
	fs = require('fs'),
	config = require('../config'),
	dataUrl = config.dataUrl,
	maxAsync = config.maxAsync,
	timeout = config.timeout,
	stockCodes = require('../data/stock-code.json'),
	async = require('async'),
	dataModel = require('../data-model'),
	StockModel = dataModel.StockModel,
	mongoose = dataModel.mongoose,
	moment = require('moment');

let processCounter = 0,
	dataLength = stockCodes.length;

let successCode = [];

function writeDate() {
	if(processCounter == dataLength){
		console.log('get stock data finished');
		const writeStream = fs.createWriteStream(`${__dirname}/../data/stock-code.json`);

		writeStream.write(JSON.stringify(successCode));
		writeStream.end(()=>{
			console.log('stock code write finished');
			fs.writeFile(`${__dirname}/../data/get-date.json`, moment().format('YYYY-MM-DD'), function(){
				process.exit(0);
			});
		});
		mongoose.connection.close();
	}
}

function saveStockData(stockData,cb){
	const stockCode = stockData.code,
		stockName = stockData.name;

	request.get(dataUrl.replace('${code}',stockCode).replace('${end}', moment().format('YYYYMMDD')),{timeout: timeout},function(err,res,body){
		processCounter += 1;
		if(err){
			console.log(`${err.code},stockCode:${stockCode},${processCounter}/${dataLength}`);
			writeDate();
			cb();
			return;
		}

		let data = /historySearchHandler\(\[(.+)\]\)/.exec(body);
		if(data){
			data = JSON.parse(data[1]);
			if(data.status == 0){
				let result = {
					code : stockCode,
					name : stockName,
					data : []
				};
				data = data.hq;
				data.forEach((item)=>{
					result.data.push({
						date : item[0],
						max : item[6],
						min : item[5],
						close : item[2],
						start : item[1]
					})
				});
				const stock = new StockModel(result);
				stock.save((err)=>{
					if(err){
						console.log(err);
					}else{
						console.log(`success,stockCode: ${stockCode},${processCounter}/${dataLength}`);
						successCode.push({
							code: stockCode,
							name: stockName
						});
					}
				})
			}else{
				console.log(`${data.msg},${processCounter}/${dataLength}`);
			}
		}else{
			console.log(`failed,stockCode: ${stockCode},${processCounter}/${dataLength}`);
		}
		writeDate();
		cb();
	});
}

fs.open(`${__dirname}/../data/get-date.json`, 'a', function(err ,data) {
	fs.readFile(`${__dirname}/../data/get-date.json`, function(err, data){
		const date = data.toString();
		if(moment().format('YYYY-MM-DD') === date){
			console.log('已为最新数据');
			process.exit(0);
			return
		}
		StockModel.remove({}).then(()=>{
			async.mapLimit(stockCodes, maxAsync, (stockData,cb)=>{
				saveStockData(stockData,cb);
			});
		});
	})
});