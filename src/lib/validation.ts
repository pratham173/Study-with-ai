export const PASSWORD_MIN_LENGTH = 8;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH;
}

export function validatePasswordsMatch(
  password: string,
  confirmPassword: string
): boolean {
  return password === confirmPassword;
}
