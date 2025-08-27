import jwt from 'jsonwebtoken';

export function generateToken() {
  return jwt.sign({ user: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '1h' });
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}
