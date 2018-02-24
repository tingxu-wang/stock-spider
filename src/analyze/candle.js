/*
* 蜡烛图分析
*
* 接收日线数据并分析是否符合蜡烛图反转符号，将符合标准的日线数据返回
*
* @param {Object} 日线数据对象
* @return {Object} 符合标准的日线数据
* */

module.exports = function(stockData) {
	const data = stockData.data, // 日线数据
		name = stockData.name,
		code = stockData.code;

	const sliceLength = 5,
		recentData = data.slice(0, sliceLength);
	const res = [];

	recentData.forEach((item, index)=>{
		item.start = Number(item.start);
		item.close = Number(item.close);
		item.max = Number(item.max);
		item.min = Number(item.min);

		let prev = recentData[index + 1];

		if(prev){
			prev.start = Number(prev.start);
			prev.close = Number(prev.close);
			prev.max = Number(prev.max);
			prev.min = Number(prev.min);
		}

		const resObj = {
			date: item.date,
			type: []
		};

		/*
		 * 十字
		 *
		 * 开盘价和收盘价间隔在0.1以内
		 * */
		if(Math.abs(item.start - item.close) <= 0.01){
			resObj.type.push('十字星');

			if(
				Math.abs(item.start - item.max) > 0.1 &&
				Math.abs(item.close - item.min) <= 0.04
			){
				resObj.type.push('墓碑十字');
			}
		}

		/*
		 * 阴包阳
		 *
		 * */
		if(
			prev &&
			Math.abs(prev.start - prev.close) > 0.2 &&
			(item.start < item.close) &&
			(prev.close < prev.start) &&
			(item.close <= prev.start) &&
			(item.start >= prev.close)
		){
			resObj.type.push('阴包阳');
		}

		/*
		 * 阳包阴
		 *
		 * */
		if(
			prev &&
			Math.abs(prev.start - prev.close) > 0.2 &&
			(item.start > item.close) &&
			(prev.close > prev.start) &&
			(item.close >= prev.start) &&
			(item.start <= prev.close)
		){
			resObj.type.push('阳包阴');
		}

		// 添加结果
		if(resObj.type.length > 0){
			resObj.type = resObj.type.join(',');
			res.push(resObj);
		}
	});

	return {
		code,
		name,
		data: res
	};
};