
// HTTP Client and configuration
export { default as httpClient } from './httpClient';
export { ENDPOINTS } from './apiConfig';
export * from './storage';

// Authentication service
export { default as authService } from './authService';
export * from './authService';

// User service
export { default as userService } from './userService';
export * from './userService';

// Resident service
export { default as residentService } from './residentService';
export * from './residentService';

// Apartment services
export { default as apartmentService } from './apartmentService';
export * from './apartmentService';

export { default as apartmentTypeService } from './apartmentTypeService';
export * from './apartmentTypeService';

// Announcement service
export { default as announcementService } from './announcementService';
export * from './announcementService';

// Feedback service
export { default as feedbackService } from './feedbackService';
export * from './feedbackService';

// Service type service
export { default as serviceTypeService } from './serviceTypeService';
export * from './serviceTypeService';

// Service registration service
export { default as serviceRegistrationService } from './serviceRegistrationService';
export * from './serviceRegistrationService';

// Invoice services
export { default as invoiceService } from './invoiceService';
export * from './invoiceService';

export { default as invoiceDetailService } from './invoiceDetailService';
export * from './invoiceDetailService';

// Import all services for the default export object
import authService from './authService';
import userService from './userService';
import residentService from './residentService';
import apartmentService from './apartmentService';
import apartmentTypeService from './apartmentTypeService';
import announcementService from './announcementService';
import feedbackService from './feedbackService';
import serviceTypeService from './serviceTypeService';
import serviceRegistrationService from './serviceRegistrationService';
import invoiceService from './invoiceService';
import invoiceDetailService from './invoiceDetailService';

const services = {
  authService,
  userService,
  residentService,
  apartmentService,
  apartmentTypeService,
  announcementService,
  feedbackService,
  serviceTypeService,
  serviceRegistrationService,
  invoiceService,
  invoiceDetailService
};

export default services;
