import { signupSchema } from "@/features/auths/schemas/auth";
import { db } from "@/lib/db";
import { hash, genSalt } from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

interface SignupInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const generateJwtToken = async (userId: string) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY); //convert string to Uint8Array (for jose library)
  return await new SignJWT({ id: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt() //iat : ms
    .setExpirationTime("30d") //exp : ms
    .sign(secret);
};

const setCookieToken = async (token: string) => {
  const cookie = await cookies(); //instance of cookies in next 15
  cookie.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60, //30 days - same as token age
  });
};

export const signup = async (input: SignupInput) => {
  try {
    const { success, data, error } = signupSchema.safeParse(input);

    if (!success) {
      return {
        message: "Please check the form for errors",
        error: error.flatten().fieldErrors,
      };
    }

    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (user) {
      return {
        message: "User already exists with this email",
      };
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(data.password, salt);

    const newUser = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    //generate token
    const token = await generateJwtToken(newUser.id);

    //store token in cookie
    await setCookieToken(token);
  } catch (error) {
    console.error("Error Sign up user : ", error);
    return {
      message: "There is an error while signing up user",
    };
  }
};
