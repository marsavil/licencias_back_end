import express from 'express';
import morgan from 'morgan';
import router from './routes/index';
import path from 'path';


const app = express();

// middlewares
app.use(morgan('dev')) 
app.use(express.json())

// routes
app.use('/api', router);

// this folder will be used to store images
app.use('/uploads', express.static(path.resolve('uploads')))

export default app;