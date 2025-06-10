export const API_BASE_URL = "https://linkoma-be.onrender.com/v1";

export const ENDPOINTS = {
  // Auth endpoints
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  // User endpoints
  USERS: "/users",                                    // POST - Create a user
  USERS_GET_ALL: "/users",                           // GET - Get all users
  USERS_CREATE_WITH_EMAIL: "/users/create-with-email", // POST - Create a user with email only
  USERS_GET_BY_EMAIL: "/users/email",               // GET - Get user by email (append /{email})
  USERS_GET_BY_ID: "/users",                        // GET - Get user by ID (append /{userId})
  USERS_UPDATE: "/users",                           // PATCH - Update user (append /{userId})
  USERS_DELETE: "/users",                           // DELETE - Delete user (append /{userId})
  // Apartment endpoints
  APARTMENTS: "/apartments",                          // POST - Create an apartment
  APARTMENTS_GET_ALL: "/apartments",                 // GET - Get all apartments
  APARTMENTS_GET_BY_ID: "/apartments",              // GET - Get apartment by ID (append /{apartmentId})
  APARTMENTS_UPDATE: "/apartments",                  // PATCH - Update apartment (append /{apartmentId})
  APARTMENTS_DELETE: "/apartments",                  // DELETE - Delete apartment (append /{apartmentId})
  // Apartment Types endpoints
  APARTMENT_TYPES: "/apartment-types",                // POST - Create an apartment type
  APARTMENT_TYPES_GET_ALL: "/apartment-types",       // GET - Get all apartment types
  APARTMENT_TYPES_GET_BY_ID: "/apartment-types",     // GET - Get apartment type by ID (append /{apartmentTypeId})
  APARTMENT_TYPES_UPDATE: "/apartment-types",        // PATCH - Update apartment type (append /{apartmentTypeId})
  APARTMENT_TYPES_DELETE: "/apartment-types",        // DELETE - Delete apartment type (append /{apartmentTypeId})
  // Announcements endpoints
  ANNOUNCEMENTS: "/announcements",                    // POST - Create an announcement
  ANNOUNCEMENTS_GET_ALL: "/announcements",           // GET - Get all announcements
  ANNOUNCEMENTS_GET_BY_ID: "/announcements",         // GET - Get announcement by ID (append /{id})
  ANNOUNCEMENTS_UPDATE: "/announcements",            // PATCH - Update announcement (append /{id})
  ANNOUNCEMENTS_DELETE: "/announcements",            // DELETE - Delete announcement (append /{id})
  ANNOUNCEMENTS_BY_USER: "/announcements/user",      // GET - Get announcements by user ID (append /{userId})
  // Feedbacks endpoints
  FEEDBACKS: "/feedbacks",                            // POST - Create a feedback
  FEEDBACKS_GET_ALL: "/feedbacks",                   // GET - Get all feedbacks
  FEEDBACKS_GET_BY_ID: "/feedbacks",                 // GET - Get feedback by ID (append /{id})
  FEEDBACKS_UPDATE: "/feedbacks",                    // PATCH - Update feedback (append /{id})
  FEEDBACKS_DELETE: "/feedbacks",                    // DELETE - Delete feedback (append /{id})
  FEEDBACKS_BY_USER: "/feedbacks/user",              // GET - Get feedbacks by user ID (append /{userId})
  // Service Types endpoints
  SERVICE_TYPES: "/service-types",                    // POST - Create a service type
  SERVICE_TYPES_GET_ALL: "/service-types",           // GET - Get all service types
  SERVICE_TYPES_GET_BY_ID: "/service-types",         // GET - Get service type by ID (append /{id})
  SERVICE_TYPES_UPDATE: "/service-types",            // PATCH - Update service type (append /{id})
  SERVICE_TYPES_DELETE: "/service-types",            // DELETE - Delete service type (append /{id})
  // Service Registrations endpoints
  SERVICE_REGISTRATIONS: "/service-registrations",                    // POST - Create a service registration
  SERVICE_REGISTRATIONS_GET_ALL: "/service-registrations",           // GET - Get all service registrations
  SERVICE_REGISTRATIONS_GET_BY_ID: "/service-registrations",         // GET - Get service registration by ID (append /{id})
  SERVICE_REGISTRATIONS_UPDATE: "/service-registrations",            // PATCH - Update service registration (append /{id})
  SERVICE_REGISTRATIONS_DELETE: "/service-registrations",            // DELETE - Delete service registration (append /{id})

  // Invoices endpoints
  INVOICES: "/invoices",                              // POST - Create an invoice
  INVOICES_GET_ALL: "/invoices",                     // GET - Get all invoices
  INVOICES_WITH_DETAILS: "/invoices/with-details",   // POST - Create an invoice with details
  INVOICES_GET_BY_ID: "/invoices",                   // GET - Get invoice by ID (append /{id})
  INVOICES_UPDATE: "/invoices",                      // PATCH - Update invoice (append /{id})
  INVOICES_DELETE: "/invoices",                      // DELETE - Delete invoice (append /{id})

  // Invoice Details endpoints
  INVOICE_DETAILS: "/invoice-details",                // POST - Create an invoice detail
  INVOICE_DETAILS_GET_ALL: "/invoice-details",       // GET - Get all invoice details
  INVOICE_DETAILS_GET_BY_ID: "/invoice-details",     // GET - Get invoice detail by ID (append /{id})
  INVOICE_DETAILS_UPDATE: "/invoice-details",        // PATCH - Update invoice detail (append /{id})
  INVOICE_DETAILS_DELETE: "/invoice-details",        // DELETE - Delete invoice detail (append /{id})
};
