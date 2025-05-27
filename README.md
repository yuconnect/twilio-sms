# Contact Card SMS Sharing App

A web application that allows users to share their contact information via SMS using Twilio. Built with Next.js and React.

## Overview

This application provides a simple way to share contact information through SMS messages. When a user enters their phone number, the system automatically sends a pre-formatted message containing contact details via Twilio's SMS service.

## Features

- Clean, modern UI built with Next.js and React
- SMS delivery powered by Twilio
- Responsive design
- Easy deployment to Vercel

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- A Twilio account with SMS capabilities
- A Vercel account (for deployment)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

⚠️ **Security Note**: Never commit your `.env.local` file to version control. It's already included in `.gitignore` for your safety.

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/twilio-sms.git
   cd twilio-sms
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up your environment variables as described above

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

1. Push your code to GitHub

2. Import your repository in Vercel:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure your environment variables in the Vercel dashboard
   - Deploy!

## Important Notes

### Twilio Account Requirements

To send SMS messages to unverified phone numbers, you'll need to:
1. Upgrade your Twilio account from trial to paid
2. Complete Twilio's verification process
3. Ensure your account has sufficient credits

### Message Content

The SMS message content is pre-formatted and includes:
- Name
- Phone number
- Email address
- Other relevant contact information

The message format is fixed and cannot be customized through the UI.

## License

MIT

## Author

Dennis Yu
