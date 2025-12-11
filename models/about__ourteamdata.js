import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  data: {
    type: Object,
    required: true,
    default: {}
  }
}, { timestamps: true, strict: false });

export default mongoose.model('about__ourteamdata', schema, 'about__ourteamdata');
