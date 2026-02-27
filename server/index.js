import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Contact endpoint (mock success)
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // simulate some processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // TODO: hook up actual email sending (nodemailer, resend, etc)
    console.log('Received message:', { name, email, message });

    res.status(200).json({ success: true, message: 'Message sent successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
