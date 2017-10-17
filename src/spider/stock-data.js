/*
* 根据股票清单获取个股股票信息
* */

const request = require('request'),
	fs = require('fs'),
	config = require('../config'),
	dataUrl = config.dataUrl,
	maxAsync = config.maxAsync,
	stockCodes = require('../data/stock-code.json'),
	async = require('async'),
	dataModel = require('../data-model'),
	StockModel = dataModel.StockModel,
	mongoose = dataModel.mongoose,
	moment = require('moment');

let processCounter = 0,
	dataLength = stockCodes.length;


function saveStockData(stockCode,cb){
	request.get(dataUrl.replace('${code}',stockCode).replace('${end}', moment().format('YYYYMMDD')),function(err,res,body){
		processCounter += 1;
		if(err){
			console.log(err);
			cb();
			return;
		}

		let data = /historySearchHandler\(\[(.+)\]\)/.exec(body)[1];
		if(data){
			data = JSON.parse(data);
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
						close : item[2]
					})
				});
				const stock = new StockModel(result);
				stock.save((err)=>{
					if(err){
						console.log(err);
					}else{
						console.log(`save stock data success, stock code is ${stockCode},${processCounter}/${dataLength}`);
					}
				})
			}else{
				console.log(`${data.msg},${processCounter}/${dataLength}`);
			}
		}else{
			console.log(`get data failed,${processCounter}/${dataLength}`);
		}
		if(processCounter == dataLength){
			mongoose.connection.close();
		}
		cb();
	});
}

StockModel.remove({}).then(()=>{
	async.mapLimit(stockCodes, maxAsync, (stockCode,cb)=>{
		saveStockData(stockCode,cb);
	});
});