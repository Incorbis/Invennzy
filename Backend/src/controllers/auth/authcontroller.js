const db = require("../../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getTableByRole = (role) => {
  if (role === "admin") return "Admin";
  if (role === "labincharge") return "LabIncharge";
  if (role === "labassistant") return "LabAssistant";
  return null;
};

const getDashboardRoute = (role) => {
  if (role === "admin") return "/admindash";
  if (role === "labincharge") return "/labinchargedash";
  if (role === "labassistant") return "/labassistantdash";
  return "/";
};

exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  // Only allow admin signup
  if (role !== "admin") {
    return res.status(403).json({ 
      message: "Signup is only allowed for admin accounts. Lab Incharge and Lab Assistant accounts are created by administrators." 
    });
  }

  const table = getTableByRole(role);
  if (!table) return res.status(400).json({ message: "Invalid role" });

  try {
    // Check if user already exists
    const [rows] = await db.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
    if (rows.length > 0) {
      return res.status(409).json({ message: "Admin account already exists" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO ${table} (name, email, password) VALUES (?, ?, ?)`, 
      [name, email, hashedPassword]
    );
    
    res.status(201).json({ 
      message: "Admin account created successfully",
      redirectUrl: "/admindash"
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ 
      message: "Signup failed", 
      error: error.message 
    });
  }
};

exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  const table = getTableByRole(role);
  if (!table) return res.status(400).json({ message: "Invalid role" });

  try {
    // Find user by email
    const [rows] = await db.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
    if (rows.length === 0) {
      return res.status(404).json({ 
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} account not found` 
      });
    }

    const user = rows[0];
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_change_this_in_production';
    const token = jwt.sign({ id: user.id, role }, jwtSecret, { expiresIn: "1d" });
    const dashboardRoute = getDashboardRoute(role);
    
    res.json({ 
      message: "Login successful", 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        role 
      },
      redirectUrl: dashboardRoute
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Login failed", 
      error: error.message 
    });
  }
};

// Optional: Add forgot password functionality
exports.forgotPassword = async (req, res) => {
  const { email, role } = req.body;
  const table = getTableByRole(role);
  if (!table) return res.status(400).json({ message: "Invalid role" });

  try {
    const [rows] = await db.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
    if (rows.length === 0) {
      return res.status(404).json({ 
        message: `No ${role} account found with this email address` 
      });
    }

    // Here you would typically:
    // 1. Generate a reset token
    // 2. Store it in database with expiration
    // 3. Send email with reset link
    
    // For now, just return success
    res.json({ 
      message: "Password reset instructions sent to your email",
      // In production, don't reveal if email exists for security
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Failed to process password reset", error: error.message });
  }
};

// Google Sign-In handler
exports.googleSignIn = async (req, res) => {
  const { token, role } = req.body;
  const table = getTableByRole(role);
  if (!table) return res.status(400).json({ message: "Invalid role" });

  try {
    // You'll need to install google-auth-library
    // npm install google-auth-library
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if user exists in the appropriate table
    const [rows] = await db.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
    
    let user;
    if (rows.length === 0) {
      // For Google Sign-In, we can create new users for any role
      // But you might want to restrict this based on your business logic
      if (role !== 'admin') {
        return res.status(403).json({ 
          message: `${role} accounts must be created by administrators. Please contact your admin.` 
        });
      }
      
      // Create new user (for admin only in this example)
      const [result] = await db.query(
        `INSERT INTO ${table} (name, email, password, google_id, profile_picture) VALUES (?, ?, ?, ?, ?)`,
        [name, email, 'google_auth', payload.sub, picture]
      );
      
      user = {
        id: result.insertId,
        name,
        email,
        role
      };
    } else {
      // User exists, update Google ID if not set
      user = rows[0];
      if (!user.google_id) {
        await db.query(
          `UPDATE ${table} SET google_id = ?, profile_picture = ? WHERE id = ?`,
          [payload.sub, picture, user.id]
        );
      }
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_change_this_in_production';
    const jwtToken = jwt.sign({ id: user.id, role }, jwtSecret, { expiresIn: "1d" });
    const dashboardRoute = getDashboardRoute(role);

    res.json({
      message: "Google Sign-In successful",
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name || name,
        email: user.email || email,
        role
      },
      redirectUrl: dashboardRoute
    });

  } catch (error) {
    console.error("Google Sign-In error:", error);
    res.status(500).json({ 
      message: "Google Sign-In failed", 
      error: error.message 
    });
  }
};