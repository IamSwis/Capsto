const express = require('express');
const bodyParser = require('body-parser');
const sendEmail = require('./sendEmail'); 

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

app.post('/send-email', (req, res) => {
  console.log('Request body:', req.body); // Log the request body

  const { name, email, phone, message } = req.body;
  const to = 'jaweconsultingllc@gmail.com'; // my receiving email
  const subject = `Message from ${name} (${email}, ${phone})`;
  const text = message;

  console.log(`Received request to send email to: ${to}, subject: ${subject}, text: ${text}`); // Log the individual fields

  sendEmail(to, subject, text)
    .then(info => {
      console.log('Email sent:', info);
      res.status(200).json({ success: true, info });
    })
    .catch(error => {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, error: error.message });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});