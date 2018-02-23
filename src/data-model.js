const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017', { useMongoClient: true });
mongoose.Promise = global.Promise;

const StockModel = mongoose.model('Stock',{
	code : String,
	name : String,
	data : Array
});

module.exports = {
	StockModel,
	mongoose,
};