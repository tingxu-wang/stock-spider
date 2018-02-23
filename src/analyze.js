/*
 * 获取mongodb中的股票数据进行数据分析
 * 获得满足入选条件的股票代码
 * */


const dataModel = require('./data-model'),
	StockModel = dataModel.StockModel,
	mongoose = dataModel.mongoose;

const candleAnalyze = require('./analyze/candle.js');

StockModel.find({code:'002664'})
.then((modelData)=>{
	modelData.forEach((stockData)=>{
		candleAnalyze(stockData);
	});

	mongoose.connection.close();
});