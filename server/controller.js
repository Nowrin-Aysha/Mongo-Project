
import bcrypt from "bcrypt";
import userModel from "./userModel.js";
import Jwt from 'jsonwebtoken';
import employeeModel from "./employeeModel.js";




export async function register(req, res) {
    
    try {
 
      
      const specialchar = /[!@#$%^&*(),.?":{}|<>]/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const { name, email, password, confirmPassword } = req.body;

  
      
      if (!name) {
        return res.status(400).send({ error: "Please enter a name" });
      }
      if (!email) {
        return res.status(400).send({ error: "Please enter an email" });
      }
      if (!emailRegex.test(email)) {
        return res.status(400).send({ error: "Please enter a valid email" });
      }
      if (!password) {
        return res.status(400).send({ error: "Password is required" });
      }
      if (password.length < 6) {
        return res.status(400).send({ error: "Password should be at least 6 characters" });
      }
      if (!specialchar.test(password)) {
        return res.status(400).send({ error: "Password should contain at least one special character" });
      }
      if (password !== confirmPassword) {
        return res.status(400).send({ error: "Password and confirm password do not match" });
      }
  
     
      const existEmail = await userModel.findOne({ email });
      if (existEmail) {
        return res.status(400).send({ error: "Email already in use" });
      }
  
      const hashPassword = await bcrypt.hash(password, 10);
  
      
      const user = new userModel({
        name,
        email,
        password: hashPassword,
      });
  
      
      await user.save();
  
      return res.status(201).send({ error: false, msg: "User registered successfully" });
  
    } catch (error) {
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }

export async function login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email) {
        return res.status(400).send({ emailError: "email should not be empty" });
      }
      if (!password) {
        return res.status(400).send({ passwordError: "password should not be empty" });
      }
      const user = await userModel.findOne({ email });

  
      if (!user) {
        return res.status(404).send({ emailError: "email not found" });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(400).send({ passwordError: "Password does not match" });
      }
      const token = Jwt.sign(
        {
          userid: user._id,
          email: user.email,
        },
        process.env.JWTS,
        { expiresIn: "30d" }
      );
  
      return res.status(200).send({
        msg: "Logged in successfully...",
        email: user.email,
        token,
      });
    } catch (error) {
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }


  export async function addEmployee(req, res) {
    const {name,position,contact}=req.body
    const userId = req.user.userid;
    const addEmp = new employeeModel({
      userId,
      name,
      position,
      contact
    });
    await addEmp.save();
    res.status(200).send('success')
  }

  export async function getEmployee(req, res) {
    try {
      const userId = req.user?.userid;
      if (!userId) {
        return res.status(400).send({
          msg: 'User ID is required',
          error: true,
        });
      }
      
      const employee = await employeeModel.find({ userId });
      
      res.status(200).send({
        msg: 'Employees retrieved successfully',
        error: false,
        employee, 
      });
    } catch (error) {
      console.error('Error retrieving employee data:', error);
      res.status(500).send({
        msg: 'Internal Server Error',
        error: true,
      });
    }
  }




  export async function updateEmployee(req, res) {
    console.log(req.user);
    
    try {
      const userId = req.user?.userid;
      const { employeeId, updateData } = req.body; 
  
      if (!userId) {
        return res.status(400).send({
          msg: 'User ID is required',
          error: true,
        });
      }
  
      if (!employeeId || !updateData) {
        return res.status(400).send({
          msg: 'Employee ID and update data are required',
          error: true,
        });
      }
  
      
      const updatedEmployee = await employeeModel.findByIdAndUpdate(
        employeeId,
        { ...updateData, userId },
        { new: true } 
      );
  
      if (!updatedEmployee) {
        return res.status(404).send({
          msg: 'Employee not found',
          error: true,
        });
      }
  
      res.status(200).send({
        msg: 'Employee updated successfully',
        error: false,
        employee: updatedEmployee,
      });
    } catch (error) {
      console.error('Error updating employee data:', error);
      res.status(500).send({
        msg: 'Internal Server Error',
        error: true,
      });
    }
  }
  



  
  export async function deleteEmployee(req, res) {
    try {
      const userId = req.user?.userid;
      const employeeId = req.params.id; 
  
      if (!userId) {
        return res.status(400).send({
          msg: 'User ID is required',
          error: true,
        });
      }
  
      
      const result = await employeeModel.findOneAndDelete({ _id: employeeId});
  
      if (!result) {
        return res.status(404).send({
          msg: 'Employee not found or does not belong to the user',
          error: true,
        });
      }
  
      res.status(200).send({
        msg: 'Employee deleted successfully',
        error: false,
        employee: result,
      });
    } catch (error) {
      console.error('Error deleting employee data:', error);
      res.status(500).send({
        msg: 'Internal Server Error',
        error: true,
      });
    }
  }

  
  