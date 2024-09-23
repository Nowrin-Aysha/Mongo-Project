import mongoose from "mongoose";

async function connect() {
    const db = await mongoose.connect("mongodb://localhost:27017");
    console.log('Connected to MongoDB ');
    return db;
  }
  export default connect;