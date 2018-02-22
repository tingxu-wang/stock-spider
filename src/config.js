module.exports = {
	// dataUrl : 'http://data.eastmoney.com/zjlx/${code}.html',
	dataUrl : 'http://q.stock.sohu.com/hisHq?code=cn_${code}&start=19901201&end=${end}&stat=1&order=D&period=d&callback=historySearchHandler&rt=jsonp&r=0.8391495715053367&0.9677250558488026',
	stockListUrl : 'http://quote.eastmoney.com/stocklist.html',
	maxAsync : 10,
	timeout: 30000
};