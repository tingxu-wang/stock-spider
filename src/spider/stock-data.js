/*
* 根据股票清单获取个股股票信息
* */

const request = require('request'),
	fs = require('fs'),
	config = require('../config'),
	dataDayUrl = config.dataDayUrl,
	dataWeekUrl = config.dataWeekUrl,
	maxAsync = config.maxAsync,
	stockCodes = require('../data/stock-code.json'),
	async = require('async'),
	dataModel = require('../data-model'),
	StockModel = dataModel.StockModel,
	mongoose = dataModel.mongoose;

let processCounter = 0,
	dataLength = stockCodes.length;


function saveStockData(stockCode,cb){
	request.get(dataWeekUrl.replace('${code}',stockCode),function(err,res,body){
		if(err){
			console.log(err);
			return;
		}

		const weekStockData = JSON.parse(body);

		if(weekStockData.errorMsg.toLowerCase() === 'success'){
			const weekData = weekStockData.mashData;

			request.get(dataDayUrl.replace('${code}',stockCode),function(err,res,body){
				processCounter += 1;
				if(err){
					console.log(err);
					return;
				}

				const dayStockData = JSON.parse(body);

				if(dayStockData.errorMsg.toLowerCase() === 'success'){
					const dayData = dayStockData.mashData;

					if(dayData && weekData){
						const stock = new StockModel({
							code : stockCode,
							dayData,
							weekData
						});
						stock.save((err)=>{
							if(err){
								console.log(err);
							}else{
								console.log(`save stock data success, stock code is ${stockCode},${processCounter}/${dataLength}`);
							}
						})
					}else{
						console.log(`save stock data failed, no data, stock code is ${stockCode},${processCounter}/${dataLength}`);
					}
				}
			});
			if(processCounter == dataLength){
				mongoose.connection.close();
			}
		}else{
			console.log(weekStockData.errorMsg)
		}
		cb();
	});
}

StockModel.remove({}).then(()=>{
	async.mapLimit(stockCodes, maxAsync, (stockCode,cb)=>{
		saveStockData(stockCode,cb);
	});
});
