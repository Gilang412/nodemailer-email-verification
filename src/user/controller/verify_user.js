import { request, response } from "express";
import jwt from "jsonwebtoken";
import db from "../../../prisma/db";

const verify_user = async (req = request, res = response) => {
    try {
        const token = req.query.token;

        if (!token) {
            return res.status(400).send('Token is missing.');
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Find the unverified user by token
        const unverifiedUser = await db.unverifiedUser.findUnique({
            where: {
                id: decoded.userId
            }
        });

        if (!unverifiedUser) {
            return res.status(404).send('User not found or already verified.');
        }

        // Move user data to User table
        const user = await db.user.create({
            data: {
                nama: unverifiedUser.nama,
                email: unverifiedUser.email
            }
        });

        // Delete unverified user data
        await db.unverifiedUser.delete({
            where: {
                id: decoded.userId
            }
        });

        return res.status(201).json({
            success: true,
            message: "Email berhasil terverifikasi",
            query: user
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export default verify_user;
