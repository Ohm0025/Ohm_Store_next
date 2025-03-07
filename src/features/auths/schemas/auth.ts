import { z } from "zod";

//define constants
const MIN_NAME_LENGTH = 3;
const MIN_PASSWORD_LENGTH = 8;
const SPEACIAL_CHARACTERS = '!@#$%^&*(),.?":{}|<>';
const VALID_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
];

//define error messages
const ERROR_MESSAGES = {
  name: `Name must be at least ${MIN_NAME_LENGTH} characters`,
  email: {
    format: "Email is not valid , Please enter a valid email",
    domain: `Email must be from one of the following domains: ${VALID_EMAIL_DOMAINS.join(
      ", "
    )}`,
  },
  password: {
    length: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    uppercase: "Password must contain at least one uppercase letter",
    lowercase: "Password must contain at least one lowercase letter",
    number: "Password must contain at least one number",
    special: `Password must contain at least one special character (${SPEACIAL_CHARACTERS})`,
  },
  confirmPassword: "Password and Confirm Password must be the same",
};

//Check Email
const isValidEmailDomain = (email: string) => {
  const domain = email ? email.split("@")[1].toLowerCase() : "";
  return VALID_EMAIL_DOMAINS.includes(domain); //true or false
};

//password schema
const passwordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH, {
    message: ERROR_MESSAGES.password.length,
  })
  .regex(/[A-Z]/, {
    message: ERROR_MESSAGES.password.uppercase,
  })
  .regex(/[a-z]/, {
    message: ERROR_MESSAGES.password.lowercase,
  })
  .regex(/[0-9]/, {
    message: ERROR_MESSAGES.password.number,
  })
  .regex(new RegExp(`[${SPEACIAL_CHARACTERS}]`), {
    message: ERROR_MESSAGES.password.special,
  });
//   .regex(/[!@#$%^&*(),.?":{}|<>]/, {
//     message: ERROR_MESSAGES.password.special,
//   });

//Main Signup Schema
export const signupSchema = z
  .object({
    name: z
      .string()
      .optional()
      .refine((name) => !name || name.length >= MIN_NAME_LENGTH, {
        message: ERROR_MESSAGES.name,
      }),
    email: z
      .string()
      .email({
        message: ERROR_MESSAGES.email.format,
      })
      .refine((email) => isValidEmailDomain(email), {
        message: ERROR_MESSAGES.email.domain,
      }),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_MESSAGES.confirmPassword,
    path: ["confirmPassword"],
  });

//Main Signin Schema
export const signinSchema = z.object({
  email: z.string().email({
    message: ERROR_MESSAGES.email.format,
  }),
  password: z.string().min(MIN_PASSWORD_LENGTH, {
    message: ERROR_MESSAGES.password.length,
  }),
});
