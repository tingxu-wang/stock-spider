/*
 * 获取mongodb中的股票数据进行数据分析
 * 获得满足入选条件的股票代码
 * */


const dataModel = require('./data-model'),
	StockModel = dataModel.StockModel,
	mongoose = dataModel.mongoose;

StockModel.find({code:'002664'})
.then((modelData)=>{
	modelData.forEach((modelItem, index)=>{
		const data = modelItem.data, // 日线数据
			code = modelItem.code;

		const sliceLength = 10,
			recentData = data.slice(0, sliceLength);
		const res = [];
		let prev;
		if(index + 1 !== sliceLength){
			prev = recentData[index + 1];

			prev.start = Number(prev.start);
			prev.close = Number(prev.close);
			prev.max = Number(prev.max);
			prev.min = Number(prev.min);
		}

		recentData.forEach((item)=>{
			item.start = Number(item.start);
			item.close = Number(item.close);
			item.max = Number(item.max);
			item.min = Number(item.min);

			const resObj = {
				date: item.date,
				type: []
			};

			/*
			 * 十字
			 *
			 * 开盘价和收盘价间隔在0.1以内
			 * */
			if(Math.abs(item.start - item.close) <= 0.05){
				resObj.type.push('十字星');

				if(
					Math.abs(item.start - item.close) < 0.05 &&
					Math.abs(item.start - item.max) > 0.1 &&
					Math.abs(item.close - item.min) <= 0.04
				){
					resObj.type.push('墓碑十字');
				}
			}

			/*
			* 阳包阴
			*
			* */
			if(
				prev &&
				(item.start < item.close) &&
				(prev.close < prev.start) &&
				(item.close >= prev.start) &&
				(item.start <= prev.close)
			){
				resObj.type.push('阳包阴');
			}

			/*
			* 阴包阳
			*
			* */
			if(
				prev &&
				(item.close < item.start) &&
				(prev.start < prev.close) &&
				(item.start >= prev.close) &&
				(item.close <= prev.start)
			){
				resObj.type.push('阴包阳');
			}

			// 添加结果
			if(resObj.type.length > 0){
				resObj.type = resObj.type.join(',');
				res.push(resObj);
			}
		});

		console.log(res);
	});

	mongoose.connection.close();
});