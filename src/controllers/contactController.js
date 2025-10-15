import ContactMessage from "../models/ContactMessage.js";
import { sendMail } from "../services/mailer.js";

export const postContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMessage = await ContactMessage.create({ name, email, message });

    await sendMail({
      to: process.env.CONTACT_EMAIL,
      subject: `New message from ${name}`,
      text: `You received a message from ${name} (${email}):\n\n${message}`,
    });

    res.status(201).json({ success: true, message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
