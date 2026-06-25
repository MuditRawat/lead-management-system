import mongoose from 'mongoose';
const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String, default: '' },
  requirement: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  emailSent: { type: Boolean, default: false },
  openCount: { type: Number, default: 0 },
  clickCount: { type: Number, default: 0 }
});
export default mongoose.model('Lead', LeadSchema);