import mongoose from 'mongoose';

import { MONGO_URI } from './env.js';

const connectDatabase = () => mongoose.connect(MONGO_URI);

export default connectDatabase;