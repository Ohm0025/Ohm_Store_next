import { signinSchema, signupSchema } from "@/features/auths/schemas/auth";
import { revalidateUserCache } from "@/features/users/db/cache";
import { getUserById } from "@/features/users/db/users";
import { db } from "@/lib/db";
import { hash, genSalt, compare } from "bcrypt";
import { jwtVerify, SignJWT } from "jose";
import { cookies, headers } from "next/headers";
import { Resend } from "resend";
import EmailTemplate from "../components/email-template";
import { JWTExpired } from "jose/errors";

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

interface ResetPasswordInput {
  token: string;
  password: string;
  confirmPassword: string;
}

const generateJwtToken = async (userId: string, exp: string = "30d") => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY); //convert string to Uint8Array (for jose library)
  return await new SignJWT({ id: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt() //iat : ms
    .setExpirationTime(exp) //exp : ms
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
  return userId ? await getUserById(userId) : null;
}; //get userid from middleware

export const signout = async () => {
  try {
    const cookie = await cookies();
    cookie.delete("token");
  } catch (err) {
    console.error("Error sign out user : ", err);
    return { message: "There is error at sign out function" };
  }
};

export const sendResetPasswordEmail = async (email: string) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return {
        message: "user not found",
      };
    }

    const token = await generateJwtToken(user.id, "15m");

    const resendLink = `${process.env.NEXT_PUBLIC_BASEURL}/auth/reset-password?token=${token}`;

    const result = await resend.emails.send({
      from: "Ohm Store <onboarding@resend.dev>",
      to: email,
      subject: "Reset your password",
      react: EmailTemplate({ fname: user.name || user.email, resendLink }),
    });

    console.log(result);
  } catch (error) {
    console.error("Error at sending reset password email : ", error);
    return {
      message: "Something wrong at sending reset password",
    };
  }
};

export const resetPassword = async (input: ResetPasswordInput) => {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const { payload } = await jwtVerify(input.token, secret);

    if (input.password !== input.confirmPassword) {
      return {
        message: "password not match",
      };
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(input.password, salt);

    const updatedUser = await db.user.update({
      where: { id: payload.id as string },
      data: {
        password: hashedPassword,
      },
    });

    revalidateUserCache(updatedUser.id);
  } catch (error) {
    console.error("Error reseting password : ", error);
    if (error instanceof JWTExpired) {
      return {
        message: "Your request is expired.",
      };
    }
    return {
      message: "Something wrong at reseting password",
    };
  }
};
