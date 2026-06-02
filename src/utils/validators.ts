export function validateRfc(value: string): boolean {
  return /^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/i.test(value.trim());
}

export function validateFiscalZipCode(value: string): boolean {
  return /^\d{5}$/.test(value.trim());
}

export function validateRequiredText(value: string): boolean {
  return value.trim().length > 0;
}
