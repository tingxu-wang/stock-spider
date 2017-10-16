module.exports = {
	// dataUrl : 'http://data.eastmoney.com/zjlx/${code}.html',
	dataDayUrl : 'https://gupiao.baidu.com/api/stocks/stockdaybar?from=pc&os_ver=1&cuid=xxx&vv=100&format=json&stock_code=${code}&step=3&start=&count=160&fq_type=no&timestamp=1508138580852',
	dataWeekUrl : 'https://gupiao.baidu.com/api/stocks/stockdaybar?from=pc&os_ver=1&cuid=xxx&vv=100&format=json&stock_code=${code}&step=3&start=&count=160&fq_type=no&timestamp=1508159401709',
	stockListUrl : 'http://quote.eastmoney.com/stocklist.html',
	maxAsync : 15
};