/**
 * Format date as YYYY-MM-DD without timezone conversion
 * This prevents the common timezone issue where dates shift by a day
 * @param {Date} date - The date object to format
 * @returns {string} - Formatted date string (YYYY-MM-DD)
 */
export const formatDateForInput = (date) => {
  if (!date || !(date instanceof Date)) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * Parse date string safely
 * @param {string} dateString - Date string to parse
 * @returns {Date|null} - Parsed date or null if invalid
 */
export const parseDateSafely = (dateString) => {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    console.log("Error parsing date:", error);
    return null;
  }
};

/**
 * Format date for display in Vietnamese locale
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string for display
 */
export const formatDateForDisplay = (date) => {
  if (!date) return "Không có thông tin";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "Không có thông tin";

    return dateObj.toLocaleDateString("vi-VN");
  } catch (error) {
    console.log("Error formatting date for display:", error);
    return "Không có thông tin";
  }
};
