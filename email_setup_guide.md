# EmailJS Setup Guide for Portfolio Contact Form

## Overview
This guide explains how to set up EmailJS to work with the portfolio website's contact form. The implementation uses EmailJS to send emails directly from the contact form without requiring a backend server.

## Files Involved
- `index.html` - Contains the EmailJS initialization script
- `js/script.js` - Contains the code that sends the email using EmailJS
- `email_template.html` - The HTML email template used for formatting emails

## Setup Instructions

### 1. Create an EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/) and create an account
2. Verify your email address

### 2. Create an Email Service
1. In the EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the instructions to connect your email account
5. Use the service name: `service_mamun`

### 3. Create an Email Template
1. In the EmailJS dashboard, go to "Email Templates"
2. Click "Create New Template"
3. Name your template `template_portfolio`
4. Use the template ID: `template_portfolio`
5. Upload or paste the contents of `email_template.html`
6. Make sure the template uses the following variables:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{subject}}` - Email subject
   - `{{message}}` - Email message

### 4. Get Your User ID (Public Key)
1. In the EmailJS dashboard, go to "Account" > "API Keys"
2. Copy your "Public Key"
3. The EmailJS initialization in `index.html` is already updated with the public key:
   ```javascript
   emailjs.init("hJ67RyoczjB9AnUB_");
   ```

## Testing the Contact Form
1. Open the portfolio website
2. Navigate to the Contact section
3. Fill out the form with test information
4. Click "Send Message"
5. Check your email to verify that you received the message with proper formatting

## Troubleshooting
- If emails are not being sent, check the browser console for error messages
- Verify that your EmailJS account is active and that you haven't exceeded the free tier limits
- Ensure that the service ID and template ID in `script.js` match the ones in your EmailJS dashboard
- Check that your email template contains all the required template variables

## Security Notes
- The EmailJS public key is safe to include in client-side code
- Do not include your EmailJS private key in any client-side code
- Consider implementing CAPTCHA to prevent spam submissions