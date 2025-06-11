import { getAllUsers, getUserById, createUser, updateUser, deleteUser, getUsersByRole, createUserWithEmail } from './userService';

// Resident service that uses user service methods
// In this app, residents are users with specific roles

export const getResidents = async () => {
  try {
    // Get all users and filter for residents on client side
    // This is more reliable if the server doesn't have role filtering endpoint
    const response = await getAllUsers();

    console.log('=== RESIDENT SERVICE DEBUG ===');
    console.log('Get all users response:', response);
    console.log('Response data type:', typeof response.data);
    console.log('Response data is array:', Array.isArray(response.data));
    console.log('Response structure keys:', response.data ? Object.keys(response.data) : 'no data');
    
    if (response.success && response.data) {
      // Check if data is an array
      let allUsers = response.data;
      
      // If data is not an array, try to extract array from data property
      if (!Array.isArray(allUsers)) {
        console.log('Data is not an array, checking for nested data...');
        console.log('Full data object:', JSON.stringify(allUsers, null, 2));
        
        // Check if data has a nested data property
        if (allUsers.data && Array.isArray(allUsers.data)) {
          allUsers = allUsers.data;
          console.log('Found nested data array:', allUsers.length, 'items');
        } 
        // Check if data has a users property
        else if (allUsers.users && Array.isArray(allUsers.users)) {
          allUsers = allUsers.users;
          console.log('Found users array:', allUsers.length, 'items');
        }
        // Check if data has items property
        else if (allUsers.items && Array.isArray(allUsers.items)) {
          allUsers = allUsers.items;
          console.log('Found items array:', allUsers.length, 'items');
        }
        else {
          console.error('Data is not an array and no nested array found. Data:', allUsers);
          return {
            success: false,
            data: [],
            message: 'Dữ liệu không hợp lệ từ server'
          };
        }
      }
      
      console.log('Processing users array:', allUsers.length, 'users');
      console.log('Sample user structure:', allUsers[0] ? JSON.stringify(allUsers[0], null, 2) : 'no users');
        // Filter users by role 'resident'
      const residents = allUsers.filter(user => {
        console.log('Checking user:', user.name || user.email, 'Role:', user.role);
        return user.role === 'resident';
      });

      console.log('All users count:', allUsers.length);
      console.log('All user roles:', allUsers.map(u => ({ name: u.name || u.email, role: u.role })));
      console.log('Filtered residents count:', residents.length);
      console.log('Filtered residents sample:', residents.slice(0, 2).map(r => ({ 
        name: r.name, 
        email: r.email, 
        role: r.role,
        userId: r.userId || r.id 
      })));
      
      return {
        success: true,
        data: residents,
        message: `Lấy danh sách cư dân thành công (${residents.length} cư dân)`
      };
    }
    
    console.log('Response unsuccessful or no data');
    return {
      success: false,
      data: [],
      message: response.message || 'Không thể lấy danh sách cư dân'
    };
  } catch (error) {
    console.error('Get residents error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    return {
      success: false,
      data: [],
      message: error.message || 'Có lỗi xảy ra khi lấy danh sách cư dân'
    };
  }
};

export const getResidentById = async (residentId) => {
  try {
    const response = await getUserById(residentId);
    return response;
  } catch (error) {
    console.error('Get resident by ID error:', error);
    throw error;
  }
};

export const createResident = async (residentData) => {
  try {
    // Add resident role to user data
    const userData = { ...residentData, role: 'resident' };
    const response = await createUserWithEmail(userData.email);
    return response;
  } catch (error) {
    console.error('Create resident error:', error);
    throw error;
  }
};

export const updateResident = async (residentId, residentData) => {
  try {
    const response = await updateUser(residentId, residentData);
    return response;
  } catch (error) {
    console.error('Update resident error:', error);
    throw error;
  }
};

export const deleteResident = async (residentId) => {
  try {
    const response = await deleteUser(residentId);
    return response;
  } catch (error) {
    console.error('Delete resident error:', error);
    throw error;
  }
};

// Function to get residents with apartment details
export const getResidentsWithApartmentDetails = async () => {
  try {
    const residentsResponse = await getResidents();
    
    if (!residentsResponse.success) {
      return residentsResponse;
    }

    // If you need apartment details, you can import apartmentService and get apartment info
    // For now, return residents with basic info
    return residentsResponse;
    
  } catch (error) {
    console.error('Get residents with apartment details error:', error);
    return {
      success: false,
      data: [],
      message: 'Có lỗi xảy ra khi lấy danh sách cư dân với thông tin căn hộ'
    };
  }
};

const residentService = {
  getResidents,
  getResidentById,
  createResident,
  updateResident,
  deleteResident,
  getResidentsWithApartmentDetails,
};

export default residentService;
