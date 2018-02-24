const moment = require('moment');

module.exports = {
	// dataUrl : 'http://q.stock.sohu.com/hisHq?code=cn_${code}&start=19901201&end=${end}&stat=1&order=D&period=d&callback=historySearchHandler&rt=jsonp&r=0.8391495715053367&0.9677250558488026',
	dataUrl : 'http://q.stock.sohu.com/hisHq?code=cn_${code}&start=20180101&end=${end}&stat=1&order=D&period=d&callback=historySearchHandler&rt=jsonp&r=0.8391495715053367&0.9677250558488026',
	stockListUrl : 'http://quote.eastmoney.com/stocklist.html',
	maxAsync : 10,
	timeout: 30000,
	scheduleMinute: 0,
	scheduleHour: 0,
	mailParams: {
		host: 'smtp.163.com', // 设置服务
		port: 465, // 端口
		sercure: true, // 是否使用TLS，true，端口为465，否则其他或者568
		auth: {
			user: 'node_mailer@163.com',
			pass: 'a12345'
		}
	},
	mailConfig: {
		from: 'node_mailer@163.com',
		to: '768165932@qq.com',
		cc: 'node_mailer@163.com',
		subject: `${moment().format('YYYY-MM-DD')} 股市分析报告`,
		html: ''
	}
};