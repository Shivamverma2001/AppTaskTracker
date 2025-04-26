import express from 'express';
import cors from 'cors';
import connectDB from './db.js';
import router from './routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(router);

if (process.env.NODE_ENV === 'production') {
    const staticPath = path.join(__dirname, '..', 'AppTaskTraker', 'dist');
    app.use(express.static(staticPath));
    console.log('Production mode');
    console.log('Serving static files from:', staticPath);
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(staticPath, 'index.html'));
    });
}

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});