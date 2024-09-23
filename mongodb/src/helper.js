import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";



export async function registerUser(credential) {
  try {
    const response = await axios.post("/api/register", credential);
    console.log(response, "Registration successful");
    return response;
  } catch (error) {
    console.log('Error during registration:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ error: 'Internal Server Error' });
  }
}


export async function loginUser(credential) {
  try {
    
    const response = await axios.post("/api/login", credential);
    return response;
  } catch (error) {
    console.log('Error during login:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ error: 'Internal Server Error' });
  }
}


export async function addEmployeeData(data) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post("/api/addEmployee", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response;
  } catch (error) {
    if (error.response) {
      console.error('Response data:', error.response.data);
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ error: 'Internal Server Error' });
  }
}


export async function fetchEmployeeData() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("/api/getEmployee", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('API Response:', response.data);
    return response.data.employee; 
  } catch (error) {
    console.error('Error fetching employee data:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ error: 'Internal Server Error' });
  }
}


export async function updateEmployeeData(employee) {
  try {
    console.log(employee,'ghtrdyhtrfjuhtyfjutyfkijmuy');
    
    const token = localStorage.getItem("token");
    const response = await axios.put(`/api/updateEmployee/${employee.id}`, employee, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.log('Error updating employee:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ error: 'Internal Server Error' });
  }
}


export async function deleteEmployeeData(id) {
  try {
    
    const token = localStorage.getItem("token");
    const response = await axios.delete(`/api/deleteEmployee/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.log('Error deleting employee:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ error: 'Internal Server Error' });
  }
}
