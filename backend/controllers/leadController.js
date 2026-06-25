import Lead from '../models/Lead.js';
import nodemailer from 'nodemailer';

// Configure Nodemailer Transporter using the automatic service handler
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD.replace(/\s+/g, ''), // Strips any accidental spaces
  },
});

// 1. Create Lead and Send Tracking Email
export const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, requirement } = req.body;
    
    // Save lead entry to MongoDB
    const newLead = new Lead({ name, email, phone, company, requirement });
    await newLead.save();

    // Construct analytics tracking links using backend base URL
    const trackingLink = `${process.env.BACKEND_URL}/track-click/${newLead._id}`;
    const trackingPixel = `${process.env.BACKEND_URL}/track-open/${newLead._id}`;

    // Professional HTML Email Layout
    const mailOptions = {
      from: `"System Support" <${process.env.SMTP_MAIL}>`,
      to: email,
      subject: 'Thank You For Contacting Us',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #007bff; text-align: center;">We Received Your Request!</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Thank you for reaching out to us. Our technical team has successfully received your submission requirements:</p>
          <blockquote style="border-left: 4px solid #007bff; background-color: #f8f9fa; padding: 12px; margin: 15px 0; font-style: italic;">
            "${requirement}"
          </blockquote>
          <p style="text-align: center; margin: 25px 0;">
            <a href="${trackingLink}" target="_blank" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Learn More About Our Services</a>
          </p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 13px; color: #777;">Best Regards,<br/>Team Analytics Operations Engine</p>
          
          <img src="${trackingPixel}" width="1" height="1" alt="" style="display:none;" />
        </div>
      `
    };

    // Await the email transfer directly so we can catch any timeout/auth drops on screen
    try {
      await transporter.sendMail(mailOptions);
      newLead.emailSent = true;
      await newLead.save();
      
      return res.status(201).json({ success: true, message: 'Lead captured and email sent successfully!' });
    } catch (mailError) {
      console.error("❌ Nodemailer Error during dispatch:", mailError.message);
      // Fallback response so user knows exactly what failed on the mail server end
      return res.status(201).json({ 
        success: true, 
        message: `Lead saved to DB, but Email failed! Error: ${mailError.message}` 
      });
    }

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Fetch Dashboard Metrics Aggregations
export const getDashboardStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const emailsSent = await Lead.countDocuments({ emailSent: true });
    
    const leads = await Lead.find({}, 'openCount clickCount');
    
    const totalOpens = leads.reduce((acc, lead) => acc + lead.openCount, 0);
    const totalClicks = leads.reduce((acc, lead) => acc + lead.clickCount, 0);

    const openRate = emailsSent > 0 ? ((totalOpens / emailsSent) * 100).toFixed(1) : 0;
    const clickRate = emailsSent > 0 ? ((totalClicks / emailsSent) * 100).toFixed(1) : 0;

    res.status(200).json({
      totalLeads,
      emailsSent,
      totalOpens,
      openRate,
      totalClicks,
      clickRate
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Track Email Open via Pixel request
export const trackOpen = async (req, res) => {
  try {
    const { id } = req.params;
    await Lead.findByIdAndUpdate(id, { $inc: { openCount: 1 } });
    console.log(`👁️ Open recorded for Lead ID: ${id}`);
    
    // Return standard transparent 1x1 GIF base64 buffer tracking pixel payload
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': pixel.length,
      'Cache-Control': 'no-store, no-cache, must-revalidate, private'
    });
    res.end(pixel);
  } catch (error) {
    res.status(500).end();
  }
};

// 4. Track Link Clicks and Redirect to Production Home URL
export const trackClick = async (req, res) => {
  try {
    const { id } = req.params;
    await Lead.findByIdAndUpdate(id, { $inc: { clickCount: 1 } });
    console.log(`🎯 Link click recorded for Lead ID: ${id}`);
    
    // Live project URL destination
    res.redirect('https://lead-management-system-sepia.vercel.app/');
  } catch (error) {
    res.status(500).send('System Redirection Failure');
  }
};