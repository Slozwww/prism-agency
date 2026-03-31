/**
 * Module d'envoi d'emails avec Nodemailer
 * Gère l'envoi d'emails pour les formulaires de contact et devis
 */

const nodemailer = require('nodemailer');

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true pour le port 465, false pour les autres ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Envoyer un email de notification pour un message de contact
 */
const sendContactEmail = async (contactData) => {
    const { name, email, phone, subject, message } = contactData;

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
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
                        <div class="field">
                            <span class="label">Nom:</span> ${name}
                        </div>
                        <div class="field">
                            <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
                        </div>
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
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✓ Email de contact envoyé:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('✗ Erreur envoi email de contact:', error);
        throw error;
    }
};

/**
 * Envoyer un email de notification pour une demande de devis
 */
const sendQuoteEmail = async (quoteData) => {
    const { name, email, phone, company, project_type, services, budget, timeline, description } = quoteData;

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: `💰 Nouvelle demande de devis - ${project_type}`,
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
                    .services-list { background: white; padding: 10px; margin-top: 5px; }
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
                            <div class="field"><span class="label">Type de projet:</span> ${project_type}</div>
                            ${services ? `<div class="field"><span class="label">Services demandés:</span><div class="services-list">${services}</div></div>` : ''}
                            ${budget ? `<div class="field"><span class="label">Budget:</span> ${budget}</div>` : ''}
                            ${timeline ? `<div class="field"><span class="label">Délai:</span> ${timeline}</div>` : ''}
                        </div>
                        
                        <div class="section">
                            <span class="label">Description du projet:</span><br>
                            <p style="background: white; padding: 15px; border-left: 4px solid #FF0000; margin-top: 10px;">${description.replace(/\n/g, '<br>')}</p>
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
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✓ Email de devis envoyé:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('✗ Erreur envoi email de devis:', error);
        throw error;
    }
};

/**
 * Vérifier la configuration email
 */
const verifyEmailConfig = async () => {
    try {
        await transporter.verify();
        console.log('✓ Configuration email vérifiée');
        return true;
    } catch (error) {
        console.error('✗ Erreur de configuration email:', error);
        return false;
    }
};

module.exports = {
    sendContactEmail,
    sendQuoteEmail,
    verifyEmailConfig
};
