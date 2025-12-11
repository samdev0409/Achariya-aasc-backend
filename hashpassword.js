// hash-password.js
import bcrypt from "bcryptjs";

async function hashPassword() {
  const password = "admin@123";

  try {
    const salt = await bcrypt.genSalt(10); // 10 rounds
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Original Password:", password);
    console.log("Hashed Password:", hashedPassword);
  } catch (err) {
    console.error("Error hashing password:", err);
  }
}

hashPassword();
