import Lead from '../models/Lead.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.SMTP_MAIL, pass: process.env.SMTP_PASSWORD },
});

export const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, requirement } = req.body;
    const newLead = new Lead({ name, email, phone, company, requirement });
    await newLead.save();

    const trackingLink = `${process.env.BACKEND_URL}/track-click/${newLead._id}`;
    const trackingPixel = `${process.env.BACKEND_URL}/track-open/${newLead._id}`;

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: 'Thank You For Contacting Us',
      html: `
        <p>Hi ${name},</p>
        <p>We received your requirement: "${requirement}"</p>
        <p><a href="${trackingLink}" target="_blank">Click Here to Visit Us</a></p>
        <img src="${trackingPixel}" width="1" height="1" alt="" style="display:none;" />
      `
    };

    transporter.sendMail(mailOptions, async (err) => {
      if (!err) { newLead.emailSent = true; await newLead.save(); }
    });

    res.status(201).json({ success: true, lead: newLead });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

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
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const trackOpen = async (req, res) => {
  try {
    await Lead.findByIdAndUpdate(req.params.id, { $inc: { openCount: 1 } });
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.writeHead(200, { 'Content-Type': 'image/gif', 'Content-Length': pixel.length });
    res.end(pixel);
  } catch (error) { res.status(500).end(); }
};

export const trackClick = async (req, res) => {
  try {
    await Lead.findByIdAndUpdate(req.params.id, { $inc: { clickCount: 1 } });
    res.redirect('https://example.com');
  } catch (error) { res.status(500).send('Error'); }
};