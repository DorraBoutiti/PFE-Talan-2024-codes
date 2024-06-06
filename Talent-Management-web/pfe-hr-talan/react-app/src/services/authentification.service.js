import axios from "axios";

export const verify_password_reset_link = async (id, token) => {
    const url = `http://localhost:5000/reset/${id}/${token}`;
    console.log(url);
    const result = await axios.get(url);
    return result;
};

export const setNewPassword = async (id, token, password) => {
    
    const url = `http://localhost:5000/reset/${id}/${token}`;    
    const result = await axios.post(url, { password });
    console.log(result);
    return result.data;
}
export const password_reset = async (email) => {
    const result = await axios.post("http://localhost:5000/reset", { email });
    return result.data;
};

export const setNewPass = async (password) => {
  try {
      const token = localStorage.getItem('token');
      const url = `http://localhost:5000/user/reset-password`;
      const result = await axios.post(url, { password }, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      console.log(result);
      return result.data;
  } catch (error) {
      console.error('Error setting new password:', error);
      throw error;
  }
};

export const login = async (dataLogin) => {
    console.log(dataLogin);
    const url = `http://localhost:5000/user/login`;
    const result = await axios.post(url, dataLogin);
    console.log(result);

    // Save the token to local storage
    if (result.data.myToken) {
        localStorage.setItem('token', result.data.myToken);
    }

    return result.data;
};


export const signup = async (dataRegister) => {
    console.log(dataRegister);
    const url = `http://localhost:5000/user/create`;
    const result = await axios.post(url, dataRegister);
    console.log(result);
    return result.data;
};


export const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/user/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      localStorage.removeItem('token'); // Remove token from local storage
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

/*
  // Function to fetch user profile
export const getUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = 'http://localhost:5000/user/profile';
      const result = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return result.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };
  
  // Function to update user profile
  export const updateUserProfile = async (userData) => {
    try {
      const token = localStorage.getItem('token');
      const url = 'http://localhost:5000/user/profile';
      const result = await axios.put(url, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return result.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };
 */ 

// Function to fetch user profile
export const getUserProfile = async () => {
  try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/user/profile', {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      return response.data;
  } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
  }
};

// Function to update user profile
export const updateUserProfile = async (userData) => {
  try {
      const token = localStorage.getItem('token');
      const response = await axios.patch('http://localhost:5000/user/profile', userData, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      return response.data;
  } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
  }
};
