import { createConnection } from "mysql2/promise";

let connection = null;

export async function connectDB(){
    try {
        connection = await createConnection({
            host: 'localhost',
            user: 'root',
            password: 'cdac',
            port: 3306,
            database: 'sparepartsinventary'
        })
        console.log("Database Connected");
    } catch(error) {
        console.log(error);
        response.send("Error While Connecting Database");
    }

    return connection;
}

export function getConnection() {
    return connection;
}