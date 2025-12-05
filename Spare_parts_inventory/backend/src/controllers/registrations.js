import { hashSync } from "bcrypt";
import { getConnection } from "../configs/dbConfigs.js";
import { ROLES } from "../constants/Roles.js";

export async function registrations(request, response) {
    try {
        const connection = await getConnection();
        const { role_id, name, email, password, phone, state, city, supplier_code } = request.body;
        const encryptedPassword = hashSync(password, 12);
        //console.log(role_id, name, email, password, phone, state, city, supplier_code);
        let query;
        let values;
        
        const sqlQuery = `
            SELECT email, phone FROM users WHERE email = ? OR phone = ?
            UNION
            SELECT email, phone FROM suppliers WHERE email = ? OR phone = ?;
        `;
        
        const [rows] = await connection.query(sqlQuery, [email, phone, email, phone]);
        console.log(rows);

        if (rows.length > 0) {
            console.log(`Email or phone found in a table.`);
            console.log('Record data:', rows[0]);
            return response.status(409).send({ message: "User Already Exists (Email or Phone)" }); // Use 409 Conflict status
        } else {
            if (supplier_code === "supplier123" && role_id === ROLES.SUPPLIER) {
                query = `INSERT INTO suppliers(role_id, supplier_name, email, password, phone, state, city) VALUES(?, ?, ?, ?, ?, ?, ?)`;
                values = [role_id, name, email, encryptedPassword, phone, state, city];
            } else if (supplier_code === "" && role_id === ROLES.USER) {
                query = `INSERT INTO users(role_id, name, email, password, phone, state, city) VALUES(?, ?, ?, ?, ?, ?, ?)`;
                values = [role_id, name, email, encryptedPassword, phone, state, city];
            } else {
                console.log("Data can't be inserted");
                return response.status(400).send({ message: "Wrong Data Inserted for Supplier Code/Role" });
            }

            const [resultSet] = await connection.query(query, values);
            
            if (resultSet.affectedRows === 1) {
                if (role_id === ROLES.SUPPLIER) {
                    return response.status(201).send({ message: `${name} registered as a Supplier` }); // Use 201 Created status
                } else if (role_id === ROLES.USER) {
                    return response.status(201).send({ message: `${name} registered as a User` });
                }
            } else {
                return response.status(500).send({ message: 'Registration failed unexpectedly' });
            }
        }

    } catch (error) {
        console.log(error);
        if (error.errno === 1062) {
            return response.status(400).send({ message: `Registered User Already Exists` });
        } else {
            return response.status(500).send({ message: 'Something went wrong' });
        }
    }
}