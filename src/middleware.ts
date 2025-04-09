import { NextRequest, NextResponse } from "next/server";
import { JWTPayload, jwtVerify } from "jose";

interface Payload extends JWTPayload {
  id: string;
}

const decryptJWT = async (token: string): Promise<Payload | null> => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as Payload;
  } catch (err) {
    console.error("Error decryp :", err);
    return null;
  }
};

export const middleware = async (req: NextRequest) => {
  const response = NextResponse.next();
  const token = req.cookies.get("token")?.value;
  if (!token) return response;

  const payload = await decryptJWT(token);
  const isTokenExpired = payload?.exp && payload.exp < Date.now() / 1000;

  if (isTokenExpired || !payload) {
    response.cookies.delete("token");
    return response;
  }

  response.headers.set("x-user-id", payload.id); //send to front-end
  return response;
};

export const config = {
  matcher: [
    "/",
    "/auth/:path*", // /auth /auth/signup /auth/signin
    "/admin/:path*",
    "/cart/:path*",
  ],
};
