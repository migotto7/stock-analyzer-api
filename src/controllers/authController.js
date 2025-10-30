import { createUser, findUser } from "../repository/userRepository.js";
import { comparePassword, encryptPassword, validateEmail } from "../utils/userUtils.js";
import jwt from "jsonwebtoken";

export async function authLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

        const isEmailValid = validateEmail(email);

        if (!isEmailValid) return res.status(400).json({ message: "Email not valid" });

        const user = await findUser(email);

        if (!user) return res.status(400).json({ message: "User not found" });

        const isHashEqual = await comparePassword(password, user.password_hash);

        if (!isHashEqual) return res.status(400).json({ message: "Invalid credentials" });
        // encriptar a senha e comparar com a do usuario encontrado

        // gerar o token jwt e enviar na res body
        const token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '7d' });

        res.status(200).json({ token, user });
    } catch (error) {
        throw error;
    }

}

export async function authRegister(req, res) {
    try {
        const { username, email, password } = req.body;

        const hasUser = await findUser(email);

        if (hasUser) return res.status(400).json({ message: "Email not valid" });

        const encryptedPassword = await encryptPassword(password);

        // encriptar a senha e mandar para a função

        const newUser = await createUser(username, email, encryptedPassword);

        // gerar o token jwt e enviar na res body
        const token = jwt.sign(newUser, process.env.SECRET_KEY, { expiresIn: '7d' });

        res.status(201).json({ token, newUser });
    } catch (error) {
        throw error;
    }
}

export async function authLogout(req, res) {

    res.status(200).json("Logout bem suscedido")
}