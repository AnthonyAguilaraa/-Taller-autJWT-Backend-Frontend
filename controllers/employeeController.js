const pool = require('../config/db'); 

// Obtener todos los empleados 
exports.getAllEmployees = async (req, res) => { 
    try { const result = await pool.query('SELECT * FROM employees'); 
        res.json(result.rows); 
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    } };

    // Insertar un empleado
exports.insertarEmpleado = async (req, res) => {
    const { first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id } = req.body;

    const query = `
        INSERT INTO employees (
            first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;

    const values = [first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id];

    try {
        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Empleado creado con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Modificar un empleado
exports.modificarEmpleado = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id } = req.body;

    const query = `
        UPDATE employees 
        SET first_name = $2, last_name = $3, email = $4, phone_number = $5, hire_date = $6, job_id = $7, 
            salary = $8, commission_pct = $9, manager_id = $10, department_id = $11
        WHERE employee_id = $1`;

    const values = [id, first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id];

    try {
        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Empleado modificado con éxito' });
        } else {
            res.status(404).json({ message: 'Empleado no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un empleado
exports.eliminarEmpleado = async (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM employees WHERE employee_id = $1';
    const values = [id];

    try {
        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Empleado eliminado con éxito' });
        } else {
            res.status(404).json({ message: 'Empleado no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Consultar un empleado por ID
exports.consultarEmpleadoPorId = async (req, res) => {
    const { id } = req.params;

    const query = 'SELECT * FROM employees WHERE employee_id = $1';
    const values = [id];

    try {
        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Empleado no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Consultar un empleado por Apellido
// Consultar empleados por apellido que contenga 's'
exports.consultarEmpleadoPorApellido = async (req, res) => {
    const { last_name } = req.params;

    const query = 'SELECT * FROM employees WHERE last_name ILIKE $1';
    const values = [`%${last_name}%`];  // Utiliza el comodín '%' para buscar 's' en cualquier parte del apellido.

    try {
        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            res.status(200).json(result.rows);  // Devuelve todos los empleados que coinciden.
        } else {
            res.status(404).json({ message: 'Empleado no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
