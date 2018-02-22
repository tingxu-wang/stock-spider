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


function saveStockData(stockCode,cb){
	request.get(dataUrl.replace('${code}',stockCode).replace('${end}', moment().format('YYYYMMDD')),{timeout: timeout},function(err,res,body){
		processCounter += 1;
		if(err){
			console.log(`${err.code},stockCode:${stockCode},${processCounter}/${dataLength}`);
			cb();
			return;
		}

		let data = /historySearchHandler\(\[(.+)\]\)/.exec(body);
		if(data){
			data = JSON.parse(data[1]);
			if(data.status == 0){
				let result = {
					code : stockCode,
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
					}
				})
			}else{
				console.log(`${data.msg},${processCounter}/${dataLength}`);
			}
		}else{
			console.log(`failed,stockCode: ${stockCode},${processCounter}/${dataLength}`);
		}
		if(processCounter == dataLength){
			console.log('finished');
			mongoose.connection.close();
			process.exit(0);
		}
		cb();
	});
}

StockModel.remove({}).then(()=>{
	async.mapLimit(stockCodes, maxAsync, (stockCode,cb)=>{
		saveStockData(stockCode,cb);
	});
});