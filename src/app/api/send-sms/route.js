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
const CONTACT_MESSAGE = `Thanks for connecting! This is Dennis Yu. Save my number +1 (562) 716-9048 and find me on LinkedIn: https://www.linkedin.com/in/yuconnect/`;

// Time window for duplicate check (24 hours in milliseconds)
const DUPLICATE_CHECK_WINDOW = 24 * 60 * 60 * 1000;

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

    // Check for recent messages to this number
    const recentMessages = await twilioClient.messages.list({
      to: formattedNumber,
      dateSentAfter: new Date(Date.now() - DUPLICATE_CHECK_WINDOW).toISOString(),
      limit: 1
    });

    if (recentMessages.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Contact not sent. Ask me to share manually.'
      }, { status: 429 });
    }

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