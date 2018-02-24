/*
* 每日下午6点执行定时任务
* 抓取数据并分析后将结果发送邮件到指定邮箱
* */
const schedule = require('node-schedule'),
	child_proccess = require('child_process');

const config = require('./config');

const rule = new schedule.RecurrenceRule();
rule.hour = config.scheduleHour;
rule.minute = config.scheduleMinute;

const job = schedule.scheduleJob(rule, function(){
	child_proccess.exec('npm run get-data && npm run analyze',(err, stdout)=> {
		if(err){
			console.log(err);
		}

		console.log(stdout);
	});
});