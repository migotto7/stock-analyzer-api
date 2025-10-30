import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    user: "admin",
    host: "localhost",
    database: "db_ibo_stock_analyzer",
    password: "admin",
    port: 5432,
});

export async function findUser(email) {
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return user.rows[0];
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export async function createUser(username, email, password_hash) {
    try {
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [username, email, password_hash]
        );
        return newUser.rows[0];
    } catch (error) {
        console.error(error.message);
        throw error;
    } 
}