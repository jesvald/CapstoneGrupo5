/**
 * Funciones de utilidad para validación de datos
 */

/**
 * Valida formato de fecha ISO 8601
 */
function isValidISODate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date) && dateString === date.toISOString().slice(0, dateString.length);
}

/**
 * Valida rango de fechas
 */
function isValidDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
}

/**
 * Valida email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida rol de usuario
 */
function isValidRole(role) {
  const validRoles = ['Admin', 'Manager', 'Analyst'];
  return validRoles.includes(role);
}

/**
 * Sanitiza entrada de usuario para prevenir SQL injection
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.replace(/[<>'"]/g, '');
}

module.exports = {
  isValidISODate,
  isValidDateRange,
  isValidEmail,
  isValidRole,
  sanitizeInput
};

