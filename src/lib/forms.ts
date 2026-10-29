import { z } from "zod";

/** Shared shape returned by every form action and consumed with useActionState. */
export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Field name → first error message. */
  errors?: Record<string, string>;
  /** Reference number shown on the success card. */
  reference?: string;
  /** Submitted values, echoed back on error so the form keeps what the person typed. */
  values?: Record<string, string>;
};

export const idleState: FormState = { status: "idle" };

export const indianStates = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

export type IndianState = (typeof indianStates)[number];

/** Two-letter codes used for Player IDs (00001-WB) and as keys in the states table. */
export const stateCodes: Record<IndianState, string> = {
  "Andaman and Nicobar Islands": "AN",
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  Assam: "AS",
  Bihar: "BR",
  Chandigarh: "CH",
  Chhattisgarh: "CG",
  "Dadra and Nagar Haveli and Daman and Diu": "DD",
  Delhi: "DL",
  Goa: "GA",
  Gujarat: "GJ",
  Haryana: "HR",
  "Himachal Pradesh": "HP",
  "Jammu and Kashmir": "JK",
  Jharkhand: "JH",
  Karnataka: "KA",
  Kerala: "KL",
  Ladakh: "LA",
  Lakshadweep: "LD",
  "Madhya Pradesh": "MP",
  Maharashtra: "MH",
  Manipur: "MN",
  Meghalaya: "ML",
  Mizoram: "MZ",
  Nagaland: "NL",
  Odisha: "OD",
  Puducherry: "PY",
  Punjab: "PB",
  Rajasthan: "RJ",
  Sikkim: "SK",
  "Tamil Nadu": "TN",
  Telangana: "TS",
  Tripura: "TR",
  "Uttar Pradesh": "UP",
  Uttarakhand: "UK",
  "West Bengal": "WB",
};

export const enquiryTypes = [
  { value: "general", label: "General enquiry" },
  { value: "corporate", label: "Corporate booking" },
  { value: "careers", label: "Careers" },
  { value: "press", label: "Press" },
] as const;

export type EnquiryType = (typeof enquiryTypes)[number]["value"];

export const registrationSteps = [
  { n: 1, title: "Submit", text: "Fill in the online form. It takes about five minutes." },
  { n: 2, title: "Review", text: "SSCFI verifies the details and calls you back." },
  { n: 3, title: "ID issued", text: "A Player ID like 00001-WB, or a certificate for teams and associations." },
  { n: 4, title: "Map updates", text: "Your district turns yellow while in discussion, then green once onboarded." },
];

/** Indian mobile number: ten digits starting 6–9, optionally prefixed with +91 or 0. */
export const mobileSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .refine((v) => /^(\+91|0)?[6-9]\d{9}$/.test(v), "Enter a valid 10-digit Indian mobile number");

export const pincodeSchema = z.string().trim().regex(/^\d{6}$/, "Enter a 6-digit pincode");

export const requiredText = (label: string, min = 2, max = 120) =>
  z
    .string()
    .trim()
    .min(min, `${label} is required`)
    .max(max, `${label} must be under ${max} characters`);

export const stateSchema = z.enum(indianStates, { message: "Choose a state or union territory" });

/** First error per field, keyed by the field name used in the form. */
export function toErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!(key in errors)) errors[key] = issue.message;
  }
  return errors;
}

/** Plain-object view of a FormData, trimming strings and dropping React's internal $ACTION_ keys. */
export function formValues(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("$ACTION_") || typeof value !== "string") continue;
    out[key] = value.trim();
  }
  return out;
}

export function yearsBetween(from: Date, to: Date) {
  let years = to.getFullYear() - from.getFullYear();
  const m = to.getMonth() - from.getMonth();
  if (m < 0 || (m === 0 && to.getDate() < from.getDate())) years -= 1;
  return years;
}

/** ISO date (yyyy-mm-dd) in the past. */
export const pastDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a date")
  .refine((v) => {
    const d = new Date(`${v}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.getTime() < Date.now();
  }, "Date of birth must be in the past");
