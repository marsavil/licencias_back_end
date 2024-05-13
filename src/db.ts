import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import mongoose from "mongoose";

dotenv.config();

const {
  MONGO_URL
} = process.env;

let isConnected =false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if(!MONGO_URL) return console.log('MONGO_URL not found');
  if(isConnected) return console.log('Already connected to MongoDB');

  try {
    await mongoose.connect(MONGO_URL);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error: any) {
    console.log(error.message);
  }
}

