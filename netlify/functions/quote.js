/**
 * Netlify Function - Formulaire de Devis
 * Remplace la route Express /api/quote
 */

const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

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
    const { name, email, phone, company, projectType, services, budget, timeline, message } = body;

    // Anti-spam honeypot
    if (body.website) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Spam détecté' })
      };
    }

    // Validation
    if (!name || name.trim().length < 2) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Nom invalide' }) };
    }
    if (!email || !email.includes('@')) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Email invalide' }) };
    }
    if (!phone || phone.trim().length < 6) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Téléphone requis' }) };
    }
    if (!projectType) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Type de projet requis' }) };
    }
    if (!message || message.trim().length < 20) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Description trop courte (minimum 20 caractères)' }) };
    }

    const servicesStr = Array.isArray(services) ? services.join(', ') : (services || '');

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
      subject: `💰 Nouvelle demande de devis - ${projectType}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #FF0000; color: white; padding: 20px; text-align: center; }
            .content { background: #f4f4f4; padding: 20px; margin-top: 20px; }
            .section { margin-bottom: 20px; }
            .field { margin-bottom: 10px; }
            .label { font-weight: bold; color: #FF0000; }
            .footer { margin-top: 20px; padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔴 PRISM AGENCY</h1>
              <p>Nouvelle demande de devis</p>
            </div>
            <div class="content">
              <div class="section">
                <h3>Informations client</h3>
                <div class="field"><span class="label">Nom:</span> ${name}</div>
                <div class="field"><span class="label">Email:</span> <a href="mailto:${email}">${email}</a></div>
                <div class="field"><span class="label">Téléphone:</span> ${phone}</div>
                ${company ? `<div class="field"><span class="label">Entreprise:</span> ${company}</div>` : ''}
              </div>
              <div class="section">
                <h3>Détails du projet</h3>
                <div class="field"><span class="label">Type de projet:</span> ${projectType}</div>
                ${servicesStr ? `<div class="field"><span class="label">Services:</span> ${servicesStr}</div>` : ''}
                ${budget ? `<div class="field"><span class="label">Budget:</span> ${budget}</div>` : ''}
                ${timeline ? `<div class="field"><span class="label">Délai:</span> ${timeline}</div>` : ''}
              </div>
              <div class="section">
                <span class="label">Description du projet:</span>
                <p style="background: white; padding: 15px; border-left: 4px solid #FF0000; margin-top: 10px;">${message.replace(/\n/g, '<br>')}</p>
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
        message: 'Votre demande de devis a été envoyée avec succès. Nous vous répondrons dans les 24 heures.'
      })
    };

  } catch (error) {
    console.error('Erreur devis:', error);
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
