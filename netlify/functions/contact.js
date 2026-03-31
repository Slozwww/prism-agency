/**
 * Netlify Function - Formulaire de Contact
 * Remplace la route Express /api/contact
 */

const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Méthode non autorisée' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { name, email, phone, subject, message } = body;

    // Anti-spam honeypot
    if (body.website) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Spam détecté' })
      };
    }

    // Validation basique
    if (!name || name.trim().length < 2) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Nom invalide (minimum 2 caractères)' }) };
    }
    if (!email || !email.includes('@')) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Email invalide' }) };
    }
    if (!message || message.trim().length < 10) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Message trop court (minimum 10 caractères)' }) };
    }

    // Envoi email via Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `💬 Nouveau message de contact - ${subject || 'Sans objet'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #FF0000; color: white; padding: 20px; text-align: center; }
            .content { background: #f4f4f4; padding: 20px; margin-top: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #FF0000; }
            .footer { margin-top: 20px; padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔴 PRISM AGENCY</h1>
              <p>Nouveau message de contact</p>
            </div>
            <div class="content">
              <div class="field"><span class="label">Nom:</span> ${name}</div>
              <div class="field"><span class="label">Email:</span> <a href="mailto:${email}">${email}</a></div>
              ${phone ? `<div class="field"><span class="label">Téléphone:</span> ${phone}</div>` : ''}
              ${subject ? `<div class="field"><span class="label">Sujet:</span> ${subject}</div>` : ''}
              <div class="field">
                <span class="label">Message:</span><br>
                <p style="background: white; padding: 15px; border-left: 4px solid #FF0000;">${message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
            <div class="footer">
              <p>Reçu le ${new Date().toLocaleString('fr-FR')}</p>
              <p>PRISM AGENCY - Agence Digitale</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les 24 heures.'
      })
    };

  } catch (error) {
    console.error('Erreur contact:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Une erreur est survenue. Veuillez réessayer plus tard.'
      })
    };
  }
};
