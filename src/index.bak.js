/*
* 获取mongodb中的股票数据进行数据分析
* 获得满足入选条件的股票代码
*
* 1. MACD图出现金叉（A）-死叉（B）-金叉（C）分布
  2. 金叉A和死叉B要持续十周以上，且在0轴以上
  3. 死叉B最低点跌破0轴时间不可大于两周，不跌破为最佳
  4. 金叉A的最高点DEA>=0.4（比较重要），死叉B的最低点0<DIF<=0.5（次要），满足以上要求，加入自选股
* */

const dataModel = require('./data-model'),
	StockModel = dataModel.StockModel,
	mongoose = dataModel.mongoose,
	macd = require('./utils/stock-indicator').MACD,
	splitBySymbol = require('./utils/split-by-symbol');

const ws = require('fs').createWriteStream('./test1.json');

const areaLength = 10,
	maxDEA = 0.4,
	maxDIF = 0.5;

StockModel.find({code:'300355'})
.then((modelData)=>{
	modelData.forEach((modelItem)=>{
		const data = modelItem.data,
			code = modelItem.code;
		const dataReverse = data.reverse(); // 日线数据
		let weekData = []; // 周线数据
		let // dateCloseArr = [], // 日线收盘价
			weekCloseArr = []; // 周线收盘价

		dataReverse.forEach((item)=>{
			const close = item.close;
			const date = item.date;
			const time = /(\d{4,4})-(\d{2,2})-(\d{2,2})/.exec(date);
			const year = time[1],month = time[2],day = time[3];

			if(new Date(year,month - 1,day).getDay() == 5){ // 获得星期五的数据，生成周线
				weekData.push(item);
				weekCloseArr.push(close);
			}

			// dateCloseArr.push(close);
		});

		const // dateMACDData = macd(dateCloseArr),
			weekMACDData = macd(weekCloseArr),
			bars = weekMACDData.bars;

		const splitArr = splitBySymbol(bars); // 根据正负号切分得到的数据

		let areaArr = []; // 符合区域长度的信息
		splitArr.forEach((item,index)=>{
			if(item.symbol && splitArr.length !== index + 1){
				const next = splitArr[index + 1];
				if(item.data.length >= areaLength && next.data.length >= areaLength){
					areaArr.push({
						greaterIndex : item.startIndex, // 金叉开始index
						lessIndex : next.startIndex, // 死叉开始index
						greaterLength : item.data.length, // 金叉持续长度
						lessLength : next.data.length // 死叉持续长度
					});
				}
			}
		});

		areaArr.forEach((item)=>{
			const greaterDifs = weekMACDData.diffs.slice(item.greaterIndex,item.greaterIndex+item.greaterLength);
			const lessDifs = weekMACDData.diffs.slice(item.lessIndex,item.lessIndex+item.lessLength);

			// const greaterDeas = weekMACDData.deas.slice(item.greaterIndex,item.greaterIndex+item.greaterLength);
			// const lessDeas = weekMACDData.deas.slice(item.lessIndex,item.lessIndex+item.lessLength);

			const splitGreaterDifs = splitBySymbol(greaterDifs);
			const lastDifs = splitGreaterDifs[splitGreaterDifs.length -1];//最后一组周线dif数据

			let greaterDifFlag = false;

			if(lastDifs.symbol && lastDifs.data.length >= 10){ // 持续10周不跌破零轴
				greaterDifFlag = true;
			}

			let lessDifFlag = true;
			lessDifs.forEach(item=>{
				if(item<0){
					lessDifFlag = false;
				}
			});


			if(greaterDifFlag && lessDifFlag){
				console.log('run')
			}

		});

		// ws.write(JSON.stringify(weekMACDData))
	});

	mongoose.connection.close();
});