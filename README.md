# LINKOMA Mobile - Hệ thống quản lý chung cư

<div align="center">
  <img src="./assets/LINKOMA_MOBILE.png" alt="LINKOMA Mobile Logo" width="200"/>
  
  [![React Native](https://img.shields.io/badge/React%20Native-0.79.3-blue.svg)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-53.0.11-black.svg)](https://expo.dev/)
  [![Yarn](https://img.shields.io/badge/Yarn-Package%20Manager-2C8EBB.svg)](https://yarnpkg.com/)
  [![TypeScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
</div>

## 📱 Tổng quan

**LINKOMA Mobile** là ứng dụng di động hỗ trợ hệ thống quản lý chung cư, được phát triển bằng React Native và Expo. Ứng dụng này là phiên bản mobile dành cho:

- **👥 Cư dân (Residents)**: Giao diện đầy đủ với tất cả tính năng
- **🏢 Admin**: Giao diện cơ bản (phiên bản web có đầy đủ tính năng hơn)

> **Lưu ý**: Phiên bản web LINKOMA dành cho Admin và Manager có đầy đủ tính năng quản lý. Mobile app tập trung vào trải nghiệm người dùng cuối và một số tính năng admin cơ bản.

## 🏗️ Kiến trúc hệ thống

```
📦 LINKOMA Ecosystem
├── 🌐 LINKOMA Web (Admin/Manager Full Features)
│   ├── Dashboard quản lý toàn diện
│   ├── Báo cáo và phân tích
│   └── Quản lý hệ thống nâng cao
│
└── 📱 LINKOMA Mobile (End Users + Basic Admin)
    ├── Cư dân: Đầy đủ tính năng
    └── Admin: Tính năng cơ bản
```

## ✨ Tính năng chính

### 👤 Dành cho Cư dân (Residents)
- **🏠 Thông tin căn hộ**: Xem thông tin căn hộ, loại căn hộ
- **📋 Quản lý hóa đơn**: Xem, thanh toán hóa đơn tiền thuê và dịch vụ
- **💬 Phản hồi**: Gửi phản hồi, khiếu nại đến ban quản lý
- **📢 Thông báo**: Nhận thông báo từ ban quản lý
- **🔧 Đăng ký dịch vụ**: Đăng ký các dịch vụ trong chung cư
- **👤 Quản lý tài khoản**: Cập nhật thông tin cá nhân, đổi mật khẩu

### 🏢 Dành cho Admin (Tính năng cơ bản)
- **📊 Dashboard**: Tổng quan cơ bản về hệ thống
- **👥 Quản lý cư dân**: CRUD cư dân (cơ bản)
- **🏠 Quản lý căn hộ**: CRUD căn hộ và loại căn hộ
- **📋 Quản lý hóa đơn**: Tạo, xem, cập nhật hóa đơn
- **💬 Quản lý phản hồi**: Xem và phản hồi feedback
- **📢 Thông báo**: Gửi thông báo tới cư dân
- **🔧 Quản lý dịch vụ**: Quản lý loại dịch vụ và đăng ký

> **Lưu ý**: Tính năng Manager hiện chưa có trong mobile app. Sử dụng phiên bản web để truy cập đầy đủ tính năng quản lý.

## 🛠️ Công nghệ sử dụng

### Frontend
- **React Native**: 0.79.3
- **Expo**: 53.0.11 (Managed Workflow)
- **React Navigation**: 7.x (Stack, Tab, Drawer)
- **Expo Vector Icons**: Icon system
- **React Native Reanimated**: Animations

### State Management & Storage
- **React Context**: Global state management
- **AsyncStorage**: Local data persistence
- **Expo SecureStore**: Secure token storage

### API & Networking
- **Axios**: HTTP client
- **REST API**: Backend communication
- **JWT**: Authentication & authorization

### Push Notifications
- **Expo Notifications**: Push notification system
- **Expo Device**: Device information
- **Expo Constants**: App constants

### Development Tools
- **Yarn**: Package manager
- **Babel**: JavaScript compiler
- **Metro**: React Native bundler
- **ESLint**: Code linting

## 📋 Yêu cầu hệ thống

### Development Environment
- **Node.js**: >= 18.x
- **Yarn**: >= 1.22.x
- **Expo CLI**: Latest version
- **Android Studio** (for Android development)
- **Xcode** (for iOS development - macOS only)

### Target Platforms
- **iOS**: >= 13.0
- **Android**: >= API 21 (Android 5.0)

## 🚀 Cài đặt và chạy dự án

### 1. Clone repository
```bash
git clone [repository-url]
cd linkoma-mobile-backup
```

### 2. Cài đặt dependencies
```bash
# Sử dụng Yarn (khuyến nghị)
yarn install

# Hoặc sử dụng npm
npm install
```

### 3. Cấu hình environment
```bash
# Tạo file .env từ template
cp .env.example .env

# Cập nhật các biến môi trường
nano .env
```

### 4. Chạy ứng dụng

#### Development Mode
```bash
# Khởi động Expo development server
yarn start

# Chạy trên Android
yarn android

# Chạy trên iOS
yarn ios

# Chạy trên web
yarn web
```

#### Production Build
```bash
# Build cho Android
expo build:android

# Build cho iOS
expo build:ios
```

## 📁 Cấu trúc dự án

```
linkoma-mobile-backup/
├── 📱 App.js                          # Entry point
├── 📱 app.json                        # Expo configuration
├── 📱 package.json                    # Dependencies
├── 📱 index.js                        # Root component
│
├── 🎨 assets/                         # Static assets
│   ├── adaptive-icon.png
│   ├── icon.png
│   ├── splash-icon.png
│   └── LINKOMA_MOBILE.png
│
├── 📂 src/
│   ├── 🧩 components/                 # Reusable components
│   │   ├── ModernButton.jsx
│   │   ├── ModernCard.jsx
│   │   ├── ModernFormInput.jsx
│   │   ├── ModernScreenWrapper.jsx
│   │   ├── PushNotificationDebug.jsx
│   │   └── TokenDebug.jsx
│   │
│   ├── 🌐 contexts/                   # React contexts
│   │   └── AuthContext.js
│   │
│   ├── 🎣 hooks/                      # Custom hooks
│   │   ├── useAuthNavigation.js
│   │   ├── usePushNotifications.js
│   │   └── useUserSetup.js
│   │
│   ├── 🧭 navigation/                 # Navigation structure
│   │   └── AppNavigator.jsx
│   │
│   ├── 📱 screens/                    # App screens
│   │   ├── 🔐 Auth/                   # Authentication
│   │   ├── 📊 Dashboard/              # Dashboards
│   │   ├── 👤 Admin/                  # Admin screens
│   │   ├── 👥 Resident/               # Resident screens
│   │   └── 🎯 OnboardingScreen/       # Onboarding
│   │
│   ├── 🔌 services/                   # API services
│   │   ├── apiConfig.js
│   │   ├── authService.js
│   │   ├── httpClient.js
│   │   ├── apartmentService.js
│   │   ├── invoiceService.js
│   │   ├── feedbackService.js
│   │   ├── notificationService.js
│   │   └── storage.js
│   │
│   └── 🛠️ utils/                      # Utilities
│       └── dateUtils.js
│
├── 📚 docs/                           # Documentation
│   ├── api-reference.md
│   ├── feature-specs.md
│   ├── endpoint-list.txt
│   └── api-schema.json
│
└── 🧪 tests/                          # Test files
    ├── test-apartment-types.md
    ├── push-notifications-guide.md
    ├── token-management-guide.md
    └── resident-invoice-integration.md
```

## 🔗 API Integration

### Backend URL
```javascript
// Production
const API_BASE_URL = "https://linkoma-be.onrender.com/v1";

// Development
const API_BASE_URL = "http://localhost:3000/v1";
```

### Authentication
- **JWT Tokens**: Access token for API requests
- **Refresh Tokens**: HttpOnly cookies for token renewal
- **Auto-logout**: Automatic logout on token expiry

### Key Endpoints
```
🔐 Auth:        /auth/login, /auth/logout
👥 Users:       /users, /users/{id}
🏠 Apartments:  /apartments, /apartment-types
📋 Invoices:    /invoices, /invoice-details
💬 Feedback:    /feedbacks
📢 Announcements: /announcements
🔧 Services:    /service-types, /service-registrations
```

## 🔐 Phân quyền và Bảo mật

### User Roles
```javascript
RESIDENT: {
  permissions: ["viewOwnData", "payInvoices", "submitFeedback"]
}

ADMIN: {
  permissions: ["fullAccess", "systemManagement", "userManagement"]
}

// Note: Manager role không có trong mobile app
// Sử dụng phiên bản web để truy cập tính năng Manager
```

### Security Features
- ✅ JWT-based authentication
- ✅ Automatic token refresh
- ✅ Secure storage (AsyncStorage + SecureStore)
- ✅ API request signing
- ✅ Role-based access control
- ✅ Input validation and sanitization

## 📱 Push Notifications

### Setup
```javascript
// Expo Notifications configuration
- Automatic token registration
- Background notification handling
- Custom notification sounds
- Deep linking support
```

### Features
- 📢 Announcement notifications
- 💰 Invoice due date reminders
- 💬 Feedback response notifications
- 🔔 System alerts

## 🧪 Testing

### Manual Testing Scripts
```bash
# Test token management
./test-token-management.bat

# Test resident invoices
./test-resident-invoices.bat

# Test apartment types
./test-apartment-types.md

# Test push notifications
./push-notifications-guide.md
```

### Testing Checklist
- [ ] Authentication flow
- [ ] Role-based navigation
- [ ] API integration
- [ ] Push notifications
- [ ] Offline functionality
- [ ] Error handling

## 📊 Performance

### Optimization
- **Lazy Loading**: Screen-based code splitting
- **Image Optimization**: Proper asset handling
- **API Caching**: Response caching for better UX
- **Memory Management**: Proper cleanup and disposal

### Monitoring
- **Error Tracking**: Custom error boundaries
- **Performance Metrics**: Loading time tracking
- **User Analytics**: Navigation and usage patterns

## 🚀 Deployment

### Development
```bash
# Start development server
yarn start

# Use Expo Go app to scan QR code
```

### Production
```bash
# Build for app stores
expo build:android --type=app-bundle
expo build:ios --type=archive

# Or use EAS Build (recommended)
eas build --platform android
eas build --platform ios
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### Code Standards
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Component Structure**: Functional components with hooks
- **File Naming**: PascalCase for components, camelCase for utilities

## 📞 Support

### Team
- **Mobile Development**: React Native Team
- **Backend API**: Node.js Team  
- **UI/UX Design**: Design Team
- **DevOps**: Infrastructure Team

> **Manager Features**: Hiện chưa available trong mobile app. Sử dụng LINKOMA Web cho đầy đủ tính năng quản lý.

### Resources
- **Documentation**: `/docs` folder
- **API Reference**: `docs/api-reference.md`
- **Troubleshooting**: `docs/troubleshooting.md`

## 📈 Roadmap

### Upcoming Features
- [ ] **Manager Dashboard**: Quản lý cư dân và hóa đơn cho Manager
- [ ] **Real-time Chat**: Resident-Manager communication
- [ ] **Payment Gateway**: Multiple payment methods
- [ ] **IoT Integration**: Smart home features
- [ ] **Visitor Management**: Guest registration system
- [ ] **Maintenance Requests**: Service request tracking
- [ ] **Community Features**: Social networking for residents

### Technical Improvements
- [ ] **Offline Mode**: Enhanced offline functionality
- [ ] **Dark Mode**: Theme switching
- [ ] **Accessibility**: Screen reader support
- [ ] **Performance**: Bundle size optimization
- [ ] **Security**: Enhanced encryption

## 📄 License

Dự án LINKOMA Mobile được phát triển cho mục đích giáo dục và thương mại.

---

<div align="center">
  <p>Made with ❤️ by LINKOMA Team</p>
  <p>© 2025 LINKOMA. All rights reserved.</p>
</div>
