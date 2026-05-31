import dbconnect from "@/lib/dbConnect";
import User from "@/model/User";  
import {z} from "zod";

import {usernameValidation} from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
  username: usernameValidation
});

export async function GET(request: Request) {
    if(request.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
    }                                          
    await dbconnect()

    try {
        const { searchParams } = new URL(request.url);
        const queryParam ={ username: searchParams.get('username') }
        const parsedQuery = UsernameQuerySchema.safeParse(queryParam);

        if (!parsedQuery.success) {
            const usernameErrors = parsedQuery.error.format().username?._errors || [];
            return new Response(JSON.stringify({ error: 'Invalid username format' }), { status: 400 });
        }
        const { username } = parsedQuery.data
        const existingVerifiedUser = await User.findOne({ username,isVerified:true  });
        if (existingVerifiedUser) {
            return Response.json({success: false, message: 'Username is already taken' }, { status: 200 });
        }

        return Response.json({ success: true, message: 'Username is available' }, { status: 200 });


    }catch (error) {
        console.error('Error checking username uniqueness:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }

}