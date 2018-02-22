/*
* 根据传入数组信息的正负号返回拆分后的数据信息
* */

module.exports = function(data){
	let splitArr = [];// 根据正负号切分得到的数据
	let splitCache = {
		// symbol,
		// startIndex,
		// data:[]
	};

	data.forEach((item,index)=>{
		const itemSymbol = item >= 0;

		if(index === 0){
			splitCache.symbol = itemSymbol;
			splitCache.data = [];
			splitCache.data.push(item);
			splitCache.startIndex = index;
		}else{
			const prevSymbol = data[index - 1] >=0;

			if(itemSymbol != prevSymbol){
				splitArr.push(splitCache);
				splitCache = {};
				splitCache.symbol = itemSymbol;
				splitCache.data = [];
				splitCache.data.push(item);
				splitCache.startIndex = index;
			}else{
				splitCache.data.push(item);
			}

			if(index + 1 === data.length){
				splitArr.push(splitCache);
			}
		}
	});

	return splitArr;
};