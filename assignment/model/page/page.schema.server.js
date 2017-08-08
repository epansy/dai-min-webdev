module.exports = function(mongoose){
    var widgetSchema = require('../widget/widget.schema.server.js')(mongoose);

    var Schema = mongoose.Schema;

    var pageSchema = new Schema({
        _website : {type : Schema.Types.ObjectId, ref : 'websiteModel'},
        name : {type : String, required : true},
        title : String,
        description : String,
        widgets : [{
            type : Schema.Types.ObjectId,
            ref : 'widgetModel'
        }],
        dateCreated : {
            type : Date,
            default: Date.now
        }
    }, {collection : 'page'});

    return pageSchema;
};