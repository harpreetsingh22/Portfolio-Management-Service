import bcrypt from 'bcrypt';

export const generatePasswordHash = async (password) => {
  try {
    const saltRounds = 10;  
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error('Error hashing the password');
  }
};

export const verifyPasswordHash = async (enteredPassword, storedHash) => {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, storedHash);
    return isMatch; 
  } catch (error) {
    console.error("Error validating password:", error);
    throw new Error('Error validating the password');
  }
};

