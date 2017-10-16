# 股市信息爬虫

## 概要

本项目是根据东方财富网的[股票代码清单](http://quote.eastmoney.com/stocklist.html)

以及百度股市通的股票[日线数据接口](https://gupiao.baidu.com/api/stocks/stockdaybar?from=pc&os_ver=1&cuid=xxx&vv=100&format=json&stock_code=sz000001&step=3&start=&count=160&fq_type=no&timestamp=1508161883165)
以及[周线数据接口](https://gupiao.baidu.com/api/stocks/stockweekbar?from=pc&os_ver=1&cuid=xxx&vv=100&format=json&stock_code=sz000001&step=3&start=&count=160&fq_type=no&timestamp=1508161934457) 

获取股票交易数据，使用本项目需要自行配置mongodb

写本项目的目的是辅助我个人更加高效的根据自己的筛选标准筛选出符合标准的股票，每周看图形实在是太繁琐了...

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