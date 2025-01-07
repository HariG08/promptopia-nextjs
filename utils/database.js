import mongoose from "mongoose";

let isConnected = false;

export const connectToDb = async () =>{

    console.log("MONGO URI 1",process.env.MONGODB_URI);
    
    // mongoose.set('strictQuery',true)

    if(isConnected){
        console.log('MongoDB is already connected!');
        return;
    }

    try {

    console.log("MONGO URI 2",process.env.MONGODB_URI);

        await mongoose.connect(process.env.MONGODB_URI,{
            dbName: "share_prompt",
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        isConnected = true;

        console.log("MongoDB Connected");
        
    } catch (error) {
        
        console.log(error);
        
    }
}