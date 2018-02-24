/*
 * 获取mongodb中的股票数据进行数据分析
 * 获得满足入选条件的股票代码
 * */


const nodeMailer = require('nodemailer'),
	async = require('async'),
	config = require('./config'),
	dataModel = require('./data-model'),
	StockModel = dataModel.StockModel,
	mongoose = dataModel.mongoose;

let transporter = nodeMailer.createTransport(config.mailParams);

const mailConfig = config.mailConfig;

const candleAnalyze = require('./analyze/candle.js');

// 获取所有股票的数据库查询结果，统一分析
StockModel.find({}).then((modelDatas)=>{

	mailConfig.html = `
	<table border="1">
		<thead>
			<tr>
				<td rowspan="2">股票代码</td>
				<td rowspan="2">名称</td>
				<td colspan="2">反转点</td>
			</tr>
			<tr>
				<td>时间</td>
				<td>类型</td>
			</tr>
		</thead>
		<tbody>
		`;

	modelDatas.forEach((stockData)=>{

		if(stockData){
			const candleResult = candleAnalyze(stockData);

			if(candleResult.data.length > 0){
				// 拼接table
				let rowContent = `
				<tr>
					<td rowspan="{rowspan}">{code}</td>
					<td rowspan="{rowspan}">{name}</td>
	
					{firstRow}
				</tr>
				`;

				// 第一行
				rowContent = rowContent
				.replace(/\{rowspan\}/g, candleResult.data.length)
				.replace('{code}', candleResult.code)
				.replace('{name}', candleResult.name)
				.replace('{firstRow}', `<td>${candleResult.data[0].date}</td><td>${candleResult.data[0].type}</td>`);

				if(candleResult.data.length > 1){
					candleResult.data.forEach((item, index)=>{
						if(index === 0) return;

						rowContent += `<tr><td>${item.date}</td><td>${item.type}</td></tr>`
					});
				}

				mailConfig.html += rowContent;
			}
		}
	});

	mailConfig.html += '</tbody></table>';

	transporter.sendMail(mailConfig, (err,info) =>{
		if(err){
			return console.log(err);
		}

		console.log('Message %s sent: %s', info.messageId, info.response);
	});

	mongoose.connection.close();
});