import { signinSchema, signupSchema } from "@/features/auths/schemas/auth";
import { revalidateUserCache } from "@/features/users/db/cache";
import { getUserById } from "@/features/users/db/users";
import { db } from "@/lib/db";
import { hash, genSalt, compare } from "bcrypt";
import { SignJWT } from "jose";
import { cookies, headers } from "next/headers";

interface SignupInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SigninInput {
  email: string;
  password: string;
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

    revalidateUserCache(newUser.id);
  } catch (error) {
    console.error("Error Sign up user : ", error);
    return {
      message: "There is an error while signing up user",
    };
  }
};

export const signin = async (input: SigninInput) => {
  try {
    const { success, data, error } = signinSchema.safeParse(input);
    if (!success) {
      return {
        message: "Please enter correct email and password",
        error: error.flatten().fieldErrors,
      };
    }

    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return {
        message: "User not found with this email and password",
      };
    }

    if (user.status !== "Active") {
      return {
        message: "User is not active",
      };
    }

    const isPasswordMatch = await compare(data.password, user.password);

    if (!isPasswordMatch) {
      return {
        message: "User not found with this email and password",
      };
    }

    //generate token
    const token = await generateJwtToken(user.id);

    //store token in cookie
    await setCookieToken(token);
  } catch (error) {
    console.error("Error Sign in user : ", error);
    return {
      message: "There is an error while signing in user",
    };
  }
};

export const authCheck = async () => {
  const userId = (await headers()).get("x-user-id");
  console.log("userId", userId);
  return userId ? await getUserById(userId) : null;
}; //get userid from middleware
