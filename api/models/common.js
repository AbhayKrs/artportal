import mongoose from 'mongoose';

const commonSchema = new mongoose.Schema(
    {
        tags: [{
            type: String
        }]
    },
);

const Common = mongoose.model('Common', commonSchema);
export default Common;
