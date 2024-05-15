import { request, response } from "express";
import jwt from "jsonwebtoken";
import db from "../../../prisma/db"
import transporter from "../utils/nodemailer";

const PORT = process.env.PORT

const register_user = async (req = request, res = response) => {
    try {
        const {nama, email} = await req.body


        const user = await db.unverifiedUser.create({
            data: {
                name: nama,
                email: email
            }
        })
        
        // Generate JWT for email verification
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Verifikasi email",
            text: `Link baru: http://localhost:${PORT}/api/user/verify?token=${token}`
        })

        return res.status(201).json({
            success: true,
            message: "Registrasi berhasil. Harap check email anda untuk verifikasi.",
            query: user
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export default register_user