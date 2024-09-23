import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { addEmployeeData, deleteEmployeeData, fetchEmployeeData, updateEmployeeData } from './helper';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const Home = () => {
  const [employee, setEmployee] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', position: '', contact: '' });
  const [openDelete, setOpenDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeData = await fetchEmployeeData();
        setEmployee(employeeData);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchData();
  }, [modalIsOpen]);

  const handleAddEmployee = async () => {
    if (newEmployee.name && newEmployee.position && newEmployee.contact) {
      const result = await addEmployeeData(newEmployee);
      if (result.status === 200) {
        setNewEmployee({ name: '', position: '', contact: '' });
        setModalIsOpen(false);
        fetchEmployeeData(); 
      }
    }
  };

  
  const handleEditEmployee = async () => {
    if (editEmployee) {
      const result = await updateEmployeeData({
        employeeId: editEmployee._id, 
        updateData: editEmployee, 
      });
      
      if (result.status === 200) {
        setEditEmployee(null);
        setModalIsOpen(false);
        fetchEmployeeData(); 
      } else {
        console.error('Failed to update employee:', result.msg);
        
      }
    }
  };
  
  

  const handleOpenDelete = (id) => {
    setConfirmDelete(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setConfirmDelete(null);
  };

  const handleDeleteEmployee = async () => {
    if (confirmDelete) {
      const result = await deleteEmployeeData(confirmDelete);
      if (result.status === 200) {
        setEmployee((prevEmployees) => prevEmployees.filter(emp => emp._id !== confirmDelete));
        fetchEmployeeData(); 
      }
      handleCloseDelete();
    }
  };

 
  const handleEdit = (index) => {
       
    setModalIsOpen(true);
    setEditEmployee({ ...employee[index] }); 
  };
  
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editEmployee) {
      handleEditEmployee();
    } else {
      handleAddEmployee();
    }
  };

  return (
    <div className="homepage">
      <div className="header">
        <h1>Employee Directory</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <button className="add-employee-button" onClick={() => { setModalIsOpen(true); setEditEmployee(null); }}>Add Employee</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employee.map((emp, index) => (
            <tr key={emp._id}>
              <td>{emp.name}</td>
              <td>{emp.position}</td>
              <td>{emp.contact}</td>
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleOpenDelete(emp._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalIsOpen && (
        <div className="modal-overlay" onClick={() => setModalIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editEmployee ? 'Edit Employee' : 'Add New Employee'}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  value={editEmployee ? editEmployee.name : newEmployee.name}
                  onChange={(e) => editEmployee ? setEditEmployee({ ...editEmployee, name: e.target.value }) : setNewEmployee({ ...newEmployee, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Position:
                <input
                  type="text"
                  value={editEmployee ? editEmployee.position : newEmployee.position}
                  onChange={(e) => editEmployee ? setEditEmployee({ ...editEmployee, position: e.target.value }) : setNewEmployee({ ...newEmployee, position: e.target.value })}
                  required
                />
              </label>
              <label>
                Contact:
                <input
                  type="text"
                  value={editEmployee ? editEmployee.contact : newEmployee.contact}
                  onChange={(e) => editEmployee ? setEditEmployee({ ...editEmployee, contact: e.target.value }) : setNewEmployee({ ...newEmployee, contact: e.target.value })}
                  required
                />
              </label>
              <button type="submit">{editEmployee ? 'Update Employee' : 'Add Employee'}</button>
              <button type="button" onClick={() => setModalIsOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
      >
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this employee?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteEmployee} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;
