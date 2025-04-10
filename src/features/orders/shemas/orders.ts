import { z } from "zod";

const MIN_ADDRESS_LENGTH = 10;
const MAX_ADDRESS_LENGTH = 255;
const PHONE_LENGTH = 10;
const PHONE_REGEX = /^((06|08)[0-9]{8})$/; //10 numbers

const ERROR_MESSAGE = {
  address: {
    min: `need more than ${MIN_ADDRESS_LENGTH} character`,
    max: `don't exceed than ${MAX_ADDRESS_LENGTH} character`,
  },
  phone: {
    length: `phone number need to have ${PHONE_LENGTH} numbers`,
    regex: "phone number is invalid",
  },
};

export const checkoutSchema = z.object({
  address: z
    .string()
    .min(MIN_ADDRESS_LENGTH, { message: ERROR_MESSAGE.address.min })
    .max(MAX_ADDRESS_LENGTH, { message: ERROR_MESSAGE.address.max }),
  phone: z
    .string()
    .length(PHONE_LENGTH, { message: ERROR_MESSAGE.phone.length })
    .regex(PHONE_REGEX, { message: ERROR_MESSAGE.phone.regex }),
  note: z.string().optional(),
});
