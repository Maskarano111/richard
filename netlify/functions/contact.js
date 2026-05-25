import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// Sanitize input to prevent XSS attacks
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .substring(0, 500);
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
}

// Rate limiter store (in-memory)
const rateLimitStore = {};

function checkRateLimit(ip, limit, window) {
  const now = Date.now();
  const key = `contact-${ip}`;
  
  if (!rateLimitStore[key]) {
    rateLimitStore[key] = { count: 1, resetTime: now + window };
    return true;
  }
  
  const record = rateLimitStore[key];
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + window;
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

// Get client IP
function getClientIp(event) {
  return event.headers['client-ip'] || 
         event.headers['x-forwarded-for']?.split(',')[0] ||
         'unknown';
}

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Rate limiting
    const clientIp = getClientIp(event);
    const allowed = checkRateLimit(clientIp, 5, 60 * 1000); // 5 requests per minute
    
    if (!allowed) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      };
    }

    // Parse request
    const body = JSON.parse(event.body);
    const { name, email, message, honeypot } = body;

    // Honeypot bot prevention
    if (honeypot && honeypot.trim()) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Message received!' }),
      };
    }

    // Validate inputs
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    if (!isValidEmail(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' }),
      };
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedMessage = sanitizeInput(message);

    // Send email via Web3Forms
    const web3formsApiKey = process.env.WEB3FORMS_ACCESS_KEY;
    
    if (web3formsApiKey) {
      const emailResponse = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: web3formsApiKey,
          name: sanitizedName,
          email: sanitizedEmail,
          message: sanitizedMessage,
          from_name: 'Richard Masika Portfolio',
        }),
      });

      const emailData = await emailResponse.json();
      
      if (!emailResponse.ok) {
        console.error('Email sending failed:', emailData);
        // Continue even if email fails
      }
    }

    // Log to console for debugging
    console.log('Contact form submission:', {
      timestamp: new Date().toISOString(),
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage.substring(0, 50) + '...',
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Message received! I will get back to you soon.',
      }),
    };

  } catch (error) {
    console.error('Contact form error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to process request' }),
    };
  }
};
