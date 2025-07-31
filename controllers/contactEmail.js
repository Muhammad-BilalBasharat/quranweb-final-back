import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../config/envConfig.js";

export const sendEmail = async (req, res) => {
  console.log("Email credentials check:", {
    EMAIL_USER: EMAIL_USER ? "✓ Set" : "✗ Missing",
    EMAIL_PASS: EMAIL_PASS
      ? "✓ Set (length: " + EMAIL_PASS?.length + ")"
      : "✗ Missing",
  });

  const { name, email, phone, message, subject } = req.body;

  // Input validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields",
      details: "Name, email, and message are required",
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email format",
    });
  }

  // Check if environment variables are loaded
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error("Missing email configuration:", {
      EMAIL_USER: !!EMAIL_USER,
      EMAIL_PASS: !!EMAIL_PASS,
    });
    return res.status(500).json({
      success: false,
      error: "Email service not configured",
      details: "Missing EMAIL_USER or EMAIL_PASS environment variables",
    });
  }

  // Validate Gmail address format
  if (!EMAIL_USER.includes("@gmail.com")) {
    return res.status(500).json({
      success: false,
      error: "Invalid Gmail address",
      details:
        "EMAIL_USER must be a valid Gmail address ending with @gmail.com",
    });
  }

  // Validate App Password format (should be 16 characters)
  if (EMAIL_PASS.length !== 16) {
    return res.status(500).json({
      success: false,
      error: "Invalid App Password format",
      details: "Gmail App Password should be exactly 16 characters long",
    });
  }

  // Create transporter with Gmail service
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  try {
    console.log("Verifying SMTP connection...");
    console.log(`Using email: ${EMAIL_USER}`);
    console.log(`App Password length: ${EMAIL_PASS.length}`);

    // Test the connection
    await transporter.verify();
    console.log("SMTP connection verified successfully");

    const mailOptions = {
      from: `"Contact Form" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      replyTo: email,
      subject: subject
        ? `Contact Form: ${subject}`
        : `New Contact Form Message from ${name}`,
      text: `
Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Subject: ${subject || "No subject provided"}

Message:
${message}

---
Submitted at: ${new Date().toLocaleString()}
IP Address: ${req.ip || req.connection.remoteAddress || "Unknown"}
User Agent: ${req.get("User-Agent") || "Unknown"}
      `.trim(),
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; margin-bottom: 25px;">
              📧 New Contact Form Submission
            </h2>
            
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <div style="margin-bottom: 15px;">
                <strong style="color: #475569;">👤 Name:</strong>
                <span style="margin-left: 10px; color: #1e293b;">${name}</span>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #475569;">📧 Email:</strong>
                <a href="mailto:${email}" style="margin-left: 10px; color: #2563eb; text-decoration: none;">${email}</a>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #475569;">📱 Phone:</strong>
                <span style="margin-left: 10px; color: #1e293b;">${
                  phone || "Not provided"
                }</span>
              </div>
              
              ${
                subject
                  ? `
              <div style="margin-bottom: 15px;">
                <strong style="color: #475569;">📋 Subject:</strong>
                <span style="margin-left: 10px; color: #1e293b;">${subject}</span>
              </div>
              `
                  : ""
              }
            </div>
            
            <div style="margin: 25px 0;">
              <strong style="color: #475569; display: block; margin-bottom: 10px;">💬 Message:</strong>
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; line-height: 1.6; color: #1e293b;">
                ${message.replace(/\n/g, "<br>")}
              </div>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
              <p style="color: #64748b; font-size: 14px; margin: 5px 0;">
                🕒 Submitted at: ${new Date().toLocaleString()}
              </p>
              <p style="color: #64748b; font-size: 12px; margin: 5px 0;">
                🌐 IP: ${req.ip || req.connection.remoteAddress || "Unknown"}
              </p>
            </div>
          </div>
        </div>
      `,
    };

    console.log("Sending email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", {
      messageId: info.messageId,
      response: info.response,
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (err) {
    console.error("Email error details:", {
      code: err.code,
      command: err.command,
      response: err.response,
      responseCode: err.responseCode,
      message: err.message,
    });

    // Handle Gmail-specific authentication errors
    if (err.code === "EAUTH" || err.responseCode === 535) {
      return res.status(401).json({
        success: false,
        error: "Gmail Authentication Failed",
        details:
          "Your Gmail credentials are not working. Please follow these steps:",
        troubleshooting: [
          "1. Make sure 2-Factor Authentication is ENABLED on your Gmail account",
          "2. Go to Google Account Settings → Security → 2-Step Verification → App passwords",
          "3. Generate a NEW App Password for 'Mail' application",
          "4. Use the 16-character App Password (not your regular Gmail password)",
          "5. Make sure EMAIL_USER is your complete Gmail address (e.g., yourname@gmail.com)",
          "6. Remove any spaces from the App Password",
          "7. Try generating a new App Password if the current one doesn't work",
        ],
        currentConfig: {
          EMAIL_USER: EMAIL_USER,
          EMAIL_PASS_LENGTH: EMAIL_PASS?.length,
          IS_GMAIL: EMAIL_USER?.includes("@gmail.com"),
        },
      });
    }

    if (err.code === "ECONNECTION" || err.code === "ETIMEDOUT") {
      return res.status(503).json({
        success: false,
        error: "Connection failed",
        details:
          "Unable to connect to Gmail SMTP server. Check your internet connection.",
      });
    }

    if (err.code === "EMESSAGE") {
      return res.status(400).json({
        success: false,
        error: "Invalid message",
        details: "There was an issue with the email content format.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Error sending email",
      details: err.message,
      code: err.code || "UNKNOWN_ERROR",
    });
  }
};

// Debug endpoint to check configuration
export const debugEmailConfig = async (req, res) => {
  return res.status(200).json({
    config: {
      EMAIL_USER: EMAIL_USER || "NOT_SET",
      EMAIL_USER_IS_GMAIL: EMAIL_USER?.includes("@gmail.com") || false,
      EMAIL_PASS_SET: !!EMAIL_PASS,
      EMAIL_PASS_LENGTH: EMAIL_PASS?.length || 0,
      EMAIL_PASS_FORMAT_VALID: EMAIL_PASS?.length === 16,
      NODE_ENV: process.env.NODE_ENV || "development",
    },
    instructions: [
      "1. EMAIL_USER should be your full Gmail address (e.g., yourname@gmail.com)",
      "2. EMAIL_PASS should be a 16-character Gmail App Password",
      "3. Enable 2FA on your Gmail account first",
      "4. Generate App Password: Google Account → Security → 2-Step Verification → App passwords",
    ],
  });
};

// Test email with detailed logging
export const sendTestEmail = async (req, res) => {
  try {
    console.log("=== EMAIL TEST START ===");
    console.log("EMAIL_USER:", EMAIL_USER);
    console.log("EMAIL_PASS length:", EMAIL_PASS?.length);
    console.log("Is Gmail address:", EMAIL_USER?.includes("@gmail.com"));

    if (!EMAIL_USER || !EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        error: "Email configuration missing",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    console.log("Testing connection...");
    await transporter.verify();
    console.log("Connection verified!");

    const testMailOptions = {
      from: EMAIL_USER,
      to: EMAIL_USER,
      subject: "✅ Test Email - Nodemailer Working",
      text: `Test email sent successfully at ${new Date().toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f0f8ff;">
          <h2 style="color: #28a745;">✅ Email Test Successful!</h2>
          <p>Your nodemailer configuration is working correctly.</p>
          <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>From:</strong> ${EMAIL_USER}</p>
          <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Configuration Details:</h3>
            <ul>
              <li>Service: Gmail</li>
              <li>User: ${EMAIL_USER}</li>
              <li>App Password Length: ${EMAIL_PASS.length} characters</li>
            </ul>
          </div>
        </div>
      `,
    };

    console.log("Sending test email...");
    const info = await transporter.sendMail(testMailOptions);
    console.log("Test email sent:", info.messageId);
    console.log("=== EMAIL TEST END ===");

    return res.status(200).json({
      success: true,
      message: "Test email sent successfully! Check your Gmail inbox.",
      messageId: info.messageId,
      sentTo: EMAIL_USER,
    });
  } catch (error) {
    console.error("=== EMAIL TEST FAILED ===");
    console.error("Error:", error.message);
    console.error("Code:", error.code);
    console.error("Response:", error.response);

    return res.status(500).json({
      success: false,
      error: "Test email failed",
      details: error.message,
      code: error.code,
      response: error.response,
    });
  }
};

// Alternative transporter configuration (if Gmail service doesn't work)
export const sendEmailAlternative = async (req, res) => {
  console.log("Using alternative SMTP configuration...");

  const { name, email, phone, message, subject } = req.body;

  // Same validation as above
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields",
      details: "Name, email, and message are required",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email format",
    });
  }

  if (!EMAIL_USER || !EMAIL_PASS) {
    return res.status(500).json({
      success: false,
      error: "Email service not configured",
    });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    await transporter.verify();
    console.log("Alternative SMTP connection verified");

    const mailOptions = {
      from: `"Contact Form" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      replyTo: email,
      subject: subject
        ? `Contact Form: ${subject}`
        : `New Message from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Subject: ${subject || "No subject"}

Message:
${message}

Sent at: ${new Date().toLocaleString()}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">New Contact Form Message</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 5px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-left: 4px solid #007bff;">
              ${message.replace(/\n/g, "<br>")}
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              Sent at: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Alternative email sent:", info.messageId);

    return res.status(200).json({
      success: true,
      message: "Email sent successfully using alternative configuration",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Alternative email error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to send email with alternative configuration",
      details: error.message,
    });
  }
};
