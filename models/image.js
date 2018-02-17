const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const imageSchema=new Schema({
    url:{type:String,required:true},
    caption:{type:String,required:true},
    owner:{type:Schema.Types.ObjectId,ref:'User',required:true},
    likes:[{type:Schema.Types.ObjectId,ref:'User',required:true}],

});


const Image=mongoose.model('Image',imageSchema);

module.exports=Image;