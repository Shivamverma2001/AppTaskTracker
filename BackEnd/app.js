import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
const app = express();
const port = process.env.PORT || 3000;
import connectDB from './db.js';
import router from './routes.js';

app.use(cors());
app.use(express.json());
app.use(router);

app.get('/', (req, res) => {
    res.send('Hello World');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/api/v1/users', (req, res) => {
    res.send('Hello World');
});

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});