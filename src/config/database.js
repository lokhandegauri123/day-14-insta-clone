const mongoose = require("mongoose")
const dns = require("dns")

// Some environments use DNS servers that block SRV lookups (needed for mongodb+srv URIs).
// Force Node to use a public resolver so Mongoose can resolve Atlas SRV records.
dns.setServers(["8.8.8.8", "1.1.1.1"])

async function connectDb(){
    await mongoose.connect(process.env.MONGO_URI)
    
    console.log("Connected to DB")
    
}

module.exports = connectDb