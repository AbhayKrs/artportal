import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
        console.log(`Database Connected: ${conn.connection.name}`);
    } catch (err) {
        console.error(`Error: ${err.message}`.trimEnd.underline);
        process.exit(1);
    }
};

export default connectDB;
