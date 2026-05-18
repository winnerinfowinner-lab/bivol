import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API contact endpoint
  app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      // Create transporter
      const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.VITE_ZOHO_USER || process.env.EMAIL_USER || "info@bivol.xyz",
          pass: process.env.VITE_ZOHO_PASSWORD || process.env.EMAIL_PASS || "Sal7sal%",
        },
      });

      // Mail options
      const mailOptions = {
        from: `"Bivol Contact" <${process.env.VITE_ZOHO_USER || process.env.EMAIL_USER || "info@bivol.xyz"}>`,
        to: "info@bivol.xyz",
        subject: `New Contact Inquiry from: ${name}`,
        replyTo: email,
        html: `
          <h3>New Website Message</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "Thank you! Your message has been sent successfully." });
    } catch (error: any) {
      console.error("Email error:", error);
      res.status(500).json({ 
        error: "Sorry, something went wrong. Please try again later.",
        details: error.message 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
