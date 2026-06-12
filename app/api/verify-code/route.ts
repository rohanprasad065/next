console.log("✅ verify-code route module loaded");  
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";  

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { code , username } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await User.findOne({ username: decodedUsername});
        if (!user) {
            return Response.json({ success: false, message: 'User not found' }, { status: 404 });
        }
        const isCodeValid = user.verifyCode === code && user.verifyCodeExpire > new Date();
        if (!isCodeValid) {
            return Response.json({ success: false, message: 'Invalid or expired verification code' }, { status: 400 });
        }
        user.isVerified = true;
        await user.save();
        return Response.json({ success: true, message: 'Email verified successfully' }, { status: 200 });   
    } catch (error) {
        console.error('Error during code verification:', error);
        return Response.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}