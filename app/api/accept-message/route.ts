import {getServerSession} from "next-auth";
import {authOptions} from "../auth/[...nextauth]/option";
import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth";


export async function POST(request: Request) {
    dbconnect();
    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;
    if (!session || !session.user) {
        return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user._id;
    const {acceptMessage} = await request.json(); 

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptMessage: acceptMessage },
            { new: true }
        );
        if (!updatedUser) {
            return Response.json({ success: false, message: 'User not found' }, { status: 404 });
        }
        return Response.json({ success: true, message: 'Accept message updated successfully' }, { status: 200 });  

    }catch (error) {
        console.error('Error updating acceptMessage:', error);
        return Response.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }

}

export async function GET(request: Request) {
    dbconnect();
    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;
    if (!session || !session.user) {
        return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user._id;
    
   try {
     const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
        return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    return Response.json({ success: true, isAcceptingMessages: foundUser.isAcceptingMessages }, { status: 200 });
    }catch (error) {
        console.error('Error updating acceptMessage:', error);
        return Response.json({ success: false, message: 'error is getting message acceptance status' }, { status: 500 });
    }
}