import { NextResponse } from 'next/server';
import twilio from 'twilio';

console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? 'Present' : 'Missing');
console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER);

// Initialize Twilio client with environment variables
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Fixed contact card message
const CONTACT_MESSAGE = `Great to connect, here's my contact:
Dennis Yu
+1 (562) 716-9048  <-- save this!
misterdennisyu@gmail.com
https://www.linkedin.com/in/yuconnect/`;

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { phoneNumber } = body;

    // Validate phone number is provided
    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Clean phone number (remove non-digits)
    const cleanedNumber = phoneNumber.replace(/\D/g, '');

    // Validate phone number is 10 digits
    if (cleanedNumber.length !== 10) {
      return NextResponse.json(
        { error: 'Phone number must be 10 digits' },
        { status: 400 }
      );
    }

    // Format phone number as +1[10digits] for US numbers
    const formattedNumber = `+1${cleanedNumber}`;

    // Send SMS using Twilio
    const message = await twilioClient.messages.create({
      body: CONTACT_MESSAGE,
      to: formattedNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    // Return success response
    return NextResponse.json({
      success: true,
      messageId: message.sid,
      to: formattedNumber,
    });

  } catch (error) {
    console.error('Error sending SMS:', error);

    // Return appropriate error response
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to send SMS',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 