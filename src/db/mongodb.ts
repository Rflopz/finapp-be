import mongoose from "mongoose";

const { MONGO_URI } = Bun.env;

const connect = async () => {
  if (!MONGO_URI) throw new Error("Server is not available");

  const connection = await mongoose.connect(MONGO_URI, {
    retryWrites: true,
    w: "majority",
  });

  return connection;
};

export const mongodb = {
  connect,
};
