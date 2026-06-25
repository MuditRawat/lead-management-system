import Lead from '../models/Lead.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD.replace(/\s+/g, ''), // Automatically strips any accidental spaces!
  },
});

export const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, requirement } = req.body;
    
    // 1. Save to Database
    const newLead = new Lead({ name, email, phone, company, requirement });
    await newLead.save();

    const trackingLink = `${process.env.BACKEND_URL}/track-click/${newLead._id}`;
    const trackingPixel = `${process.env.BACKEND_URL}/track-open/${newLead._id}`;

    const mailOptions = {
      from: `"System Support" <${process.env.SMTP_MAIL}>`,
      to: email,
      subject: 'Thank You For Contacting Us',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <p>Hi ${name},</p>
          <p>Thank you for reaching out. We received your requirement:</p>
          <blockquote style="background: #f4f4f4; padding: 10px;">"${requirement}"</blockquote>
          <p><a href="${trackingLink}" target="_blank">Click Here to Visit Us</a></p>
          <img src="${trackingPixel}" width="1" height="1" alt="" style="display:none;" />
        </div>
      `
    };

    // 2. CRITICAL CHANGE: Force Node to wait for Gmail's response
    try {
      await transporter.sendMail(mailOptions);
      newLead.emailSent = true;
      await newLead.save();
      
      return res.status(201).json({ success: true, message: 'Lead captured and email sent successfully!' });
    } catch (mailError) {
      console.error("❌ Nodemailer Error caught during submission:", mailError.message);
      // Even if email fails, we tell the frontend it was a mail setup issue
      return res.status(201).json({ 
        success: true, 
        message: `Lead saved to DB, but Email failed! Error: ${mailError.message}` 
      });
    }

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- Keep your getDashboardStats, trackOpen, and trackClick functions exactly the same below ---
export const getDashboardStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const emailsSent = await Lead.countDocuments({ emailSent: true });
    const leads = await Lead.find({}, 'openCount clickCount');
    const totalOpens = leads.reduce((acc, lead) => acc + lead.openCount, 0);
    const totalClicks = leads.reduce((acc, lead) => acc + lead.clickCount, 0);
    const openRate = emailsSent > 0 ? ((totalOpens / emailsSent) * 100).toFixed(1) : 0;
    const clickRate = emailsSent > 0 ? ((totalClicks / emailsSent) * 100).toFixed(1) : 0;
    res.status(200).json({ totalLeads, emailsSent, totalOpens, openRate, totalClicks, clickRate });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

export const trackOpen = async (req, res) => {
  try {
    await Lead.findByIdAndUpdate(req.params.id, { $inc: { openCount: 1 } });
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.writeHead(200, { 'Content-Type': 'image/gif', 'Content-Length': pixel.length, 'Cache-Control': 'no-store, no-cache, must-revalidate, private' });
    res.end(pixel);
  } catch (error) { res.status(500).end(); }
};

export const trackClick = async (req, res) => {
  try {
    await Lead.findByIdAndUpdate(req.params.id, { $inc: { clickCount: 1 } });
    res.redirect('https://lead-management-system-sepia.vercel.app/');
  } catch (error) { res.status(500).send('System Redirection Failure'); }
};