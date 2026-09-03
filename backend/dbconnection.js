import mongoose from "mongoose";
import dns from "dns";

const dbconnection = async () => {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);

  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("✅ MongoDB Atlas Connected");
    console.log("Connection State:", mongoose.connection.readyState);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:");
    console.error(error);
  }
};

export default dbconnection;