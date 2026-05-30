import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";    

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        })
        if (existingUserVerifiedByUsername) {
            return Response.json({ sucess:false, message: 'Username is already taken '}, { status: 400 });
        }

        const existingUserByEmail = await UserModel.findOne({
            email,
        });
        const verifycode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({ success: false, message: 'Email is already registered' }, { status: 400 });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifycode;
                existingUserByEmail.verifyCodeExpire = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }    

        }else
        {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser =  new UserModel({
                  username,
                    email,
                    password: hashedPassword,
                    verifyCode: verifycode,
                    verifyCodeExpire: expiryDate,
                    isVerified: false,
                    isAcceptingMessages: true,
                    messages: [],
            })
            await newUser.save();
        }
        // Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifycode);
        if (!emailResponse.success) {
            return Response.json({ success: false, message: emailResponse.message }, { status: 500 });
        }
        return Response.json({ success: true, message: 'Signup successful, verification email sent' }, { status: 200 });
 
    }catch (error) {
        console.error('Error during signup:', error);
        return Response.json({ success: false, message: 'An error occurred during signup' }, { status: 500 });
    }

}