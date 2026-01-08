// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// 🔹 Configure your email account here
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  auth: {
    user: 'candari.arvin@gmail.com', // Your email
    pass: 'iqbu ptwz fzfk fhsq', // App password if using Gmail
  },
});

// 🔹 POST endpoint to send payment emails
app.post('/send-payment-email', async (req, res) => {
  const { userEmail, action, referenceNumber, amount } = req.body;

  if (!userEmail || !action || !referenceNumber || !amount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Email content (HTML template)
  const mailOptions = {
    from: '"Admin" <your.email@gmail.com>', // Sender
    to: userEmail, // Recipient
    subject: `Payment ${action} Notification`,
    html: `
      <div style="font-family: system-ui, sans-serif; font-size: 14px; color: #2c3e50;">
        <h2>Payment ${action.charAt(0).toUpperCase() + action.slice(1)}</h2>
        <p>Hi,</p>
        <p>Your payment with <strong>Reference No: ${referenceNumber}</strong> for <strong>₱${amount.toLocaleString()}</strong> has been <strong>${action}</strong>.</p>
        <p>Please contact support if you have any questions.</p>
        <hr style="border: 0; border-top: 1px solid #ccc;" />
        <p style="font-size: 12px; color: #888;">This is an automated message from Admin Dashboard.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail} for ${action}`);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ message: 'Failed to send email', error: err });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`NodeMailer server running on http://localhost:${PORT}`);
});
