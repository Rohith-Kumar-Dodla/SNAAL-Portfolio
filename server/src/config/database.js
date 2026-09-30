import mongoose from'mongoose';import{env}from'./env.js';
export async function connectDatabase(){if(!env.MONGODB_URI){console.warn('MongoDB URI is not configured; server will run in limited mode.');return false}await mongoose.connect(env.MONGODB_URI,{serverSelectionTimeoutMS:5000});return true}
export async function disconnectDatabase(){if(mongoose.connection.readyState!==0)await mongoose.disconnect()}
export function databaseStatus(){const states=['disconnected','connected','connecting','disconnecting'];return{configured:Boolean(env.MONGODB_URI),state:states[mongoose.connection.readyState]||'unknown',ready:mongoose.connection.readyState===1}}
