const mongoose=require('mongoose');
const server=mongoose.connect(
  "mongodb+srv://selvakumard274:vsbbus123@busweb.ibkkn8h.mongodb.net/?retryWrites=true&w=majority", 
  {
    useNewUrlParser: true,    
    useUnifiedTopology: true
  }
).then(()=>{
	console.log("Connected Mongo DB!....")
}).catch((e)=>{
	console.log(e);
})

module.exports=server;