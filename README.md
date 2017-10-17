# 股市信息爬虫

## 概要

本项目是根据东方财富网的[股票代码清单](http://quote.eastmoney.com/stocklist.html)

以及搜狐的[股票历史数据接口](http://q.stock.sohu.com/hisHq?code=cn_000001&start=20171016&end=20171017&stat=1&order=D&period=d&callback=historySearchHandler&rt=jsonp&r=0.8391495715053367&0.9677250558488026)

获取股票交易数据，使用本项目需要自行配置mongodb

目前设置的最大并发数是15，嫌慢可以在config.js中更改maxAsync变量

写本项目的目的是辅助我个人更加高效的根据自己的筛选标准筛选出符合标准的股票，每周看图形实在是太繁琐了...

还有就是src文件夹下的index.js文件我用来做数据分析用了所以没有放上来

## 使用方法：

- 安装依赖
`
    npm install
`
- 获取股票代码
`
    npm run stock-code
`
- 获取股票信息(需要先执行上方脚本命令)
`
    npm run stock-data
`

股票获取完成后便可通过响应mongodb命令获取名为Stock的表中的数据了