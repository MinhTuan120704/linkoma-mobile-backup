import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Auth Context
import { useAuth } from '../contexts/AuthContext';

// Screens
import OnboardingScreen from '../screens/OnboardingScreen/OnboardingScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import ChangePasswordScreen from '../screens/Auth/ChangePasswordScreen';
import UpdateUserInfoScreen from '../screens/Auth/UpdateUserInfoScreen';

// Dashboard Screens
import AdminDashboard from '../screens/Dashboard/AdminDashboard';
import ResidentDashboard from '../screens/Dashboard/ResidentDashboard';

// Admin Screens
import ApartmentCreateScreen from '../screens/Admin/ApartmentManagement/ApartmentCreateScreen';
import ApartmentEditScreen from '../screens/Admin/ApartmentManagement/ApartmentEditScreen';
import ApartmentViewScreen from '../screens/Admin/ApartmentManagement/ApartmentViewScreen';

import FeedbackCreateScreen from '../screens/Admin/FeedbackManagement/FeedbackCreateScreen';
import FeedbackEditScreen from '../screens/Admin/FeedbackManagement/FeedbackEditScreen';
import FeedbackViewScreen from '../screens/Admin/FeedbackManagement/FeedbackViewScreen';

import InvoiceCreateScreen from '../screens/Admin/InvoiceManagement/InvoiceCreateScreen';
import InvoiceEditScreen from '../screens/Admin/InvoiceManagement/InvoiceEditScreen';
import InvoiceViewScreen from '../screens/Admin/InvoiceManagement/InvoiceViewScreen';

import NotificationCreateScreen from '../screens/Admin/NotificationManagement/NotificationCreateScreen';
import NotificationEditScreen from '../screens/Admin/NotificationManagement/NotificationEditScreen';
import NotificationViewScreen from '../screens/Admin/NotificationManagement/NotificationViewScreen';

import ResidentCreateScreen from '../screens/Admin/ResidentManagement/ResidentCreateScreen';
import ResidentEditScreen from '../screens/Admin/ResidentManagement/ResidentEditScreen';
import ResidentViewScreen from '../screens/Admin/ResidentManagement/ResidentViewScreen';

import ServiceFeeCreateScreen from '../screens/Admin/ServiceFeeManagement/ServiceFeeCreateScreen';
import ServiceFeeEditScreen from '../screens/Admin/ServiceFeeManagement/ServiceFeeEditScreen';
import ServiceFeeViewScreen from '../screens/Admin/ServiceFeeManagement/ServiceFeeViewScreen';

// Resident Screens
import ResidentApartmentInfoScreen from '../screens/Resident/ResidentApartmentInfoScreen/ResidentApartmentInfoScreen';
import ResidentFeedbackListScreen from '../screens/Resident/ResidentFeedbackListScreen/ResidentFeedbackListScreen';
import ResidentFeedbackCreateScreen from '../screens/Resident/ResidentFeedbackListScreen/ResidentFeedbackCreateScreen';
import ResidentFeedbackEditScreen from '../screens/Resident/ResidentFeedbackListScreen/ResidentFeedbackEditScreen';
import ResidentFeedbackViewScreen from '../screens/Resident/ResidentFeedbackListScreen/ResidentFeedbackViewScreen';
import ResidentInfoScreen from '../screens/Resident/ResidentInfoScreen/ResidentInfoScreen';
import ResidentInvoiceListScreen from '../screens/Resident/ResidentInvoiceListScreen/ResidentInvoiceListScreen';
import ResidentInvoicePaymentScreen from '../screens/Resident/ResidentInvoiceListScreen/ResidentInvoicePaymentScreen';
import ResidentInvoiceViewScreen from '../screens/Resident/ResidentInvoiceListScreen/ResidentInvoiceViewScreen';
import ResidentNotificationListScreen from '../screens/Resident/ResidentNotificationListScreen/ResidentNotificationListScreen';
import ResidentNotificationViewScreen from '../screens/Resident/ResidentNotificationListScreen/ResidentNotificationViewScreen';
import ResidentServiceListScreen from '../screens/Resident/ResidentServiceListScreen/ResidentServiceListScreen';
import ResidentServiceRegisterScreen from '../screens/Resident/ResidentServiceListScreen/ResidentServiceRegisterScreen';

const Stack = createNativeStackNavigator();

// Helper function to check if this is first time login
const isFirstTimeLogin = (user) => {
  if (!user) return false;
  
  // Check if user has not set their name yet (indicates first login)
  return !user.name || user.name === null || user.name.trim() === '';
};

// Helper function to check if user info is complete
const isUserInfoComplete = (user) => {
  if (!user) return false;
  
  // Check for essential fields
  const requiredFields = ['fullName', 'phone', 'idCard'];
  
  for (const field of requiredFields) {
    if (!user[field] || user[field].trim() === '') {
      return false;
    }
  }
  
  return true;
};

// Loading screen component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
  </View>
);

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false,
      animation: 'slide_from_right'
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <Stack.Screen name="UpdateUserInfo" component={UpdateUserInfoScreen} />
  </Stack.Navigator>
);

// Admin Stack
const AdminStack = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false,
      animation: 'slide_from_right'
    }}
  >
    <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
    
    {/* Apartment Management */}
    <Stack.Screen name="ApartmentCreate" component={ApartmentCreateScreen} />
    <Stack.Screen name="ApartmentEdit" component={ApartmentEditScreen} />
    <Stack.Screen name="ApartmentView" component={ApartmentViewScreen} />
    
    {/* Feedback Management */}
    <Stack.Screen name="FeedbackCreate" component={FeedbackCreateScreen} />
    <Stack.Screen name="FeedbackEdit" component={FeedbackEditScreen} />
    <Stack.Screen name="FeedbackView" component={FeedbackViewScreen} />
    
    {/* Invoice Management */}
    <Stack.Screen name="InvoiceCreate" component={InvoiceCreateScreen} />
    <Stack.Screen name="InvoiceEdit" component={InvoiceEditScreen} />
    <Stack.Screen name="InvoiceView" component={InvoiceViewScreen} />
    
    {/* Notification Management */}
    <Stack.Screen name="NotificationCreate" component={NotificationCreateScreen} />
    <Stack.Screen name="NotificationEdit" component={NotificationEditScreen} />
    <Stack.Screen name="NotificationView" component={NotificationViewScreen} />
    
    {/* Resident Management */}
    <Stack.Screen name="ResidentCreate" component={ResidentCreateScreen} />
    <Stack.Screen name="ResidentEdit" component={ResidentEditScreen} />
    <Stack.Screen name="ResidentView" component={ResidentViewScreen} />
    
    {/* Service Fee Management */}
    <Stack.Screen name="ServiceFeeCreate" component={ServiceFeeCreateScreen} />
    <Stack.Screen name="ServiceFeeEdit" component={ServiceFeeEditScreen} />
    <Stack.Screen name="ServiceFeeView" component={ServiceFeeViewScreen} />
    
    {/* Shared screens */}
    <Stack.Screen name="UpdateUserInfo" component={UpdateUserInfoScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
  </Stack.Navigator>
);

// Resident Stack
const ResidentStack = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false,
      animation: 'slide_from_right'
    }}
  >
    <Stack.Screen name="ResidentDashboard" component={ResidentDashboard} />
    <Stack.Screen name="ResidentInfo" component={ResidentInfoScreen} />
    <Stack.Screen name="ResidentApartmentInfo" component={ResidentApartmentInfoScreen} />
    
    {/* Feedback Screens */}
    <Stack.Screen name="ResidentFeedbackList" component={ResidentFeedbackListScreen} />
    <Stack.Screen name="ResidentFeedbackCreate" component={ResidentFeedbackCreateScreen} />
    <Stack.Screen name="ResidentFeedbackEdit" component={ResidentFeedbackEditScreen} />
    <Stack.Screen name="ResidentFeedbackView" component={ResidentFeedbackViewScreen} />
    
    {/* Invoice Screens */}
    <Stack.Screen name="ResidentInvoiceList" component={ResidentInvoiceListScreen} />
    <Stack.Screen name="ResidentInvoiceView" component={ResidentInvoiceViewScreen} />
    <Stack.Screen name="ResidentInvoicePayment" component={ResidentInvoicePaymentScreen} />
    
    {/* Notification Screens */}
    <Stack.Screen name="ResidentNotificationList" component={ResidentNotificationListScreen} />
    <Stack.Screen name="ResidentNotificationView" component={ResidentNotificationViewScreen} />
    
    {/* Service Screens */}
    <Stack.Screen name="ResidentServiceList" component={ResidentServiceListScreen} />
    <Stack.Screen name="ResidentServiceRegister" component={ResidentServiceRegisterScreen} />
    
    {/* Shared screens */}
    <Stack.Screen name="UpdateUserInfo" component={UpdateUserInfoScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
  </Stack.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, user, loading, checkAuthStatus } = useAuth();
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    // Check if this is first launch (you can use AsyncStorage for this)
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      // You can implement first launch check using AsyncStorage
      // For now, we'll assume it's not first launch
      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Error checking first launch:', error);
      setIsFirstLaunch(false);
    }
  };

  // Show loading screen while checking auth status or first launch
  if (loading || isFirstLaunch === null) {
    return <LoadingScreen />;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Not authenticated - show onboarding or auth flow
          <>
            {isFirstLaunch && (
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            )}
            <Stack.Screen name="Auth" component={AuthStack} />
          </>
        ) : (
          // Authenticated - check first login, then user info completeness and role
          <>
            {isFirstTimeLogin(user) ? (
              // First time login - force password change
              <Stack.Screen 
                name="ForceChangePassword" 
                component={ChangePasswordScreen}
                initialParams={{ 
                  isFirstLogin: true,
                  userId: user?.id,
                  userEmail: user?.email,
                  userData: user
                }}
                options={{
                  gestureEnabled: false, // Prevent going back
                }}
              />
            ) : !isUserInfoComplete(user) ? (
              // User info incomplete - force update
              <Stack.Screen 
                name="ForceUpdateInfo" 
                component={UpdateUserInfoScreen}
                options={{
                  gestureEnabled: false, // Prevent going back
                }}
              />
            ) : user?.role === 'admin' ? (
              // Admin user with complete info
              <Stack.Screen name="AdminApp" component={AdminStack} />
            ) : (
              // Resident user with complete info  
              <Stack.Screen name="ResidentApp" component={ResidentStack} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default AppNavigator;