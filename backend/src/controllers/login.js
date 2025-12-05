import jwt from "jsonwebtoken";
import { getConnection } from "../configs/dbConfigs.js";
import { compareSync } from "bcrypt";
import { TABLES } from "../constants/Roles.js";
import dotenv from "dotenv";
dotenv.config();

export async function loginCheck(request, response) {
  try {
    const connection = await getConnection();
    const { email, password } = request.body;

    for (const { table, id } of TABLES) {
      const [rows] = await connection.query(`SELECT * FROM ${table} WHERE email=?`, [email]);
      if (rows.length && compareSync(password, rows[0].password)) {
        const user = rows[0];
        const user_id = user[id];
        const role = user.role_id;
        const token = jwt.sign(
          { user_id: user_id, role: role },
          process.env.SECRET_KEY
        );
        console.log(`Person Logged In → ${user[id]} | Role → ${user.role_id}`);
        return response.status(200).send({ token,user_id, role, message: "Login successful" });
      }
    }

    response.status(400).send({ message: "Login failed, email or password invalid" });
  } catch (error) {
    console.error(error);
    response.status(500).send({ message: "Internal server error" });
  }
}