const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require('axios');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use(express.static('public'));

let pythonProcess = null;

// Function to start the Python script
function startPythonScript() {
    pythonProcess = spawn('python', [path.join(__dirname, 'ctrader_client.py')]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Python stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
    });
}

// Start the Python script when the server starts
startPythonScript();

// Endpoint to handle sending emails
app.post('/send-email', (req, res) => {
    const { name, email, phone, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'your-email@gmail.com', // Replace with your email
            pass: 'your-email-password'   // Replace with your email password
        }
    });

    const mailOptions = {
        from: email,
        to: 'your-email@gmail.com',      // Replace with your email
        subject: `Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Error sending email' });
        } else {
            return res.status(200).json({ success: true, message: 'Email sent successfully' });
        }
    });
});

// Function to get cTrader access token
const CLIENT_ID = 'your_client_id';
const CLIENT_SECRET = 'your_client_secret';

async function getAccessToken() {
    const response = await axios.post('https://id.ctrader.com/connect/token', null, {
        params: {
            grant_type: 'client_credentials',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return response.data.access_token;
}

// Endpoint to get live data from cTrader
app.get('/live-data', async (req, res) => {
    try {
        const accessToken = await getAccessToken();
        const accountId = 'your_account_id'; // Replace with your actual account ID

        const response = await axios.get(`https://openapi.ctrader.com/accounts/${accountId}/balance`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
