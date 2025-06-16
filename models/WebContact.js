import mongoose from "mongoose";

const webContactSchema = new mongoose.Schema({
  whatsApp: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneOne: {
    type: String,
  },
  phoneTwo: {
    type: String,
  },
  phoneThree: {
    type: String,
  },
  address: {
    type: String,
  },
  facebook: {
    type: String,
  },
  twitter: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  youtube: {
    type: String,
  },
  instagram: {
    type: String,
  },
});

const WebContact = mongoose.model("WebContact", webContactSchema);

export default WebContact;
