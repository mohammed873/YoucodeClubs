const mongoose = require("mongoose");

const connection = {};

async function dbConnect(){
    if(connection.isConnected){
        return;
    }

    const db = await mongoose.connect(process.env.MONGO_URI , {
        useNewUrlParser : true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })

    connection.isConnected = db.connections[0].readyState;
    console.log(connection.isConnected , "mongo db is connected");
}

export default dbConnect;