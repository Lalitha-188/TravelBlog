const mongoose=require("mongoose")

const descriptionSchema=mongoose.Schema({
    title:{
        type:String,
        required:true   
    },
    itenary:{
        type:[String],
        required:true   
    },
    tales:{
        type:String,
        required:true   
    },
    days:{
        type:Number,
        required:true
          
    },
    file:{
        type:String,
       
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

module.exports=mongoose.model("Description",descriptionSchema)
