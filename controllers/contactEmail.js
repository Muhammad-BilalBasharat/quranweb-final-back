import nodemailer from "nodemailer"
import { EMAIL_USER, EMAIL_PASS } from "../config/envConfig.js"

export const sendEmail = async (req, res) => {
  const { name, email, phone, message } = req.body

  // Input validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields",
      details: "Name, email, and message are required",
    })
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email format",
    })
  }

  // Check if environment variables are loaded
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error("Missing email configuration:", { EMAIL_USER: !!EMAIL_USER, EMAIL_PASS: !!EMAIL_PASS })
    return res.status(500).json({
      success: false,
      error: "Email service not configured",
    })
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  try {
    console.log("Verifying SMTP connection...")
    console.log(`Using email: ${EMAIL_USER}`)
    await transporter.verify()
    console.log("SMTP connection verified successfully")

    // Send email
    const mailOptions = {
      from: `"Contact Form" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      replyTo: email,
      subject: `Contact Form Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nMessage: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h3 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h3>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 10px 0;"><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <div style="margin: 20px 0;">
              <strong>Message:</strong>
              <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px; border-left: 4px solid #007bff;">
                ${message.replace(/\n/g, "<br>")}
              </div>
            </div>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Sent at: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", info.messageId)

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    })
  } catch (err) {
    console.error("Email error:", err)

    if (err.code === "EAUTH") {
      return res.status(401).json({
        success: false,
        error: "Authentication failed",
        details: "Please check your email credentials. Make sure you are using an App Password if 2FA is enabled.",
      })
    }

    if (err.code === "ECONNECTION" || err.code === "ETIMEDOUT") {
      return res.status(503).json({
        success: false,
        error: "Connection failed",
        details: "Unable to connect to email server. Please try again later.",
      })
    }

    if (err.code === "EMESSAGE") {
      return res.status(400).json({
        success: false,
        error: "Invalid message",
        details: "There was an issue with the email content.",
      })
    }

    return res.status(500).json({
      success: false,
      error: "Error sending email",
      details: err.message,
    })
  }
}
