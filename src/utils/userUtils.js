export function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

import bcrypt from "bcrypt";
const saltRounds = 12;

export async function encryptPassword(password) {
    try {
        const passwordHashed = await bcrypt.hash(password, saltRounds);
        return passwordHashed;
    } catch (error) {
        throw error;
    }
}

export async function comparePassword(password, hash) {
    try {
        const comparePassword = await bcrypt.compare(password, hash);
        return comparePassword;
    } catch (error) {
        throw error;
    }
}