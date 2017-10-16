const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017', { useMongoClient: true });
mongoose.Promise = global.Promise;

const StockModel = mongoose.model('Stock',{
	code : String,
	dayData : Array,
	weekData : Array
});

module.exports = {
	StockModel,
	mongoose,
};