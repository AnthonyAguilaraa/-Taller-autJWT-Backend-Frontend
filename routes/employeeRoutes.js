const express = require('express'); 
const router = express.Router(); 

const employeeController = require('../controllers/employeeController'); 
const authenticateToken = require('../middleware/auth'); 

router.get('/empleados', authenticateToken, employeeController.getAllEmployees); 
router.get('/empleados/:id', authenticateToken, employeeController.consultarEmpleadoPorId); 
router.get('/empleados/apellido/:last_name', authenticateToken, employeeController.consultarEmpleadoPorApellido);
router.post('/empleados', authenticateToken, employeeController.insertarEmpleado); 
router.put('/empleados/:id', authenticateToken, employeeController.modificarEmpleado); 
router.delete('/empleados/:id', authenticateToken, employeeController.eliminarEmpleado); 

module.exports = router;