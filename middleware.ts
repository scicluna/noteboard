// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server"

// export default async function middleware(req: NextRequest) {
//     console.log(`Next Middleware for API called: ${req.url}`);
//     try {
//         // try to get a token from the request
//         const token = await getToken({ req });
//         console.log(token)
//         if (token) {
//             // yay, token available, we are authenticated
//             return NextResponse.next();
//         } else {
//             // oh noes, no token, no fun
//             console.log("no token");

//             // send back a 401
//             return new NextResponse(
//                 JSON.stringify({ success: false, message: "no token" }),
//                 { status: 401, headers: { "content-type": "application/json" } }
//             );
//         }
//     } catch (error: any) {
//         // omg, something really bad happened, send back a 500
//         console.log(error);
//         return new NextResponse(
//             JSON.stringify({ success: false, message: error.message }),
//             { status: 500, headers: { "content-type": "application/json" } }
//         );
//     }
// }

export { default } from "next-auth/middleware"

/* This tells the middleware to only run on the routes that match the pattern. */
export const config = {
    matcher: ["/api/board/:path*", "/user/:path*"],
};