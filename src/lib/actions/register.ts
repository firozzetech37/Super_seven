"use server";

import { z } from "zod";
import {
  formValues,
  mobileSchema,
  pastDateSchema,
  pincodeSchema,
  requiredText,
  stateSchema,
  toErrors,
  yearsBetween,
  type FormState,
} from "@/lib/forms";
import { saveDistrict, savePlayer, saveTeam, SubmissionError } from "@/lib/submissions";

const isBot = (formData: FormData) => Boolean(formData.get("website"));
const invalid = (error: z.ZodError, values: Record<string, string>): FormState => ({
  status: "error",
  message: "Please check the highlighted fields.",
  errors: toErrors(error),
  values,
});
const failed = (error: unknown, values: Record<string, string>): FormState => ({
  status: "error",
  message: error instanceof SubmissionError ? error.message : "Something went wrong. Please try again.",
  values,
});

/* ---------- Player ---------- */

const playerSchema = z
  .object({
    fullName: requiredText("Full name"),
    guardianName: requiredText("Father or guardian name"),
    email: z.email("Enter a valid email address"),
    mobile: mobileSchema,
    dob: pastDateSchema,
    gender: z.enum(["Male", "Female", "Other"], { message: "Choose a gender" }),
    address: requiredText("Address", 5, 240),
    pincode: pincodeSchema,
    city: requiredText("City"),
    state: stateSchema,
    category: z.enum(["Junior", "Senior", "Women", "Corporate"], { message: "Choose a category" }),
    battingStyle: z.enum(["Right-hand", "Left-hand"], { message: "Choose a batting style" }),
    bowlingStyle: z.enum(
      ["Right-arm fast", "Right-arm medium", "Right-arm spin", "Left-arm fast", "Left-arm medium", "Left-arm spin", "None"],
      { message: "Choose a bowling style" },
    ),
    club: z.string().trim().max(120).optional(),
    guardianConsent: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    const age = yearsBetween(new Date(`${v.dob}T00:00:00Z`), new Date());
    if (age < 18 && v.guardianConsent !== "on") {
      ctx.addIssue({ code: "custom", path: ["guardianConsent"], message: "A parent or guardian must consent for players under 18" });
    }
  });

export async function registerPlayer(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isBot(formData)) return { status: "success", reference: "player-ok" };
  const values = formValues(formData);
  const parsed = playerSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const { guardianConsent, ...rest } = parsed.data;
  try {
    const { reference } = await savePlayer({ ...rest, guardianConsent: guardianConsent === "on" });
    return {
      status: "success",
      reference,
      message: "Your player registration has been received. SSCFI will verify the details and call you back before issuing your Player ID.",
    };
  } catch (error) {
    return failed(error, values);
  }
}

/* ---------- Team / club ---------- */

const teamSchema = z.object({
  teamName: requiredText("Team name"),
  city: requiredText("City"),
  state: stateSchema,
  captainName: requiredText("Captain's name"),
  captainMobile: mobileSchema,
  viceCaptainName: requiredText("Vice-captain's name"),
  squad: z
    .string()
    .transform((v) =>
      v
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean),
    )
    .refine((names) => names.length === 12, "List exactly 12 players, one name per line"),
  coachName: requiredText("Coach or manager name"),
  coachContact: mobileSchema,
  previousTournaments: z.string().trim().max(1000).optional(),
});

export async function registerTeam(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isBot(formData)) return { status: "success", reference: "team-ok" };
  const values = formValues(formData);
  const parsed = teamSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  try {
    const { reference } = await saveTeam(parsed.data);
    return {
      status: "success",
      reference,
      message: "Your team registration has been received. SSCFI will verify the squad and send the team certificate by email.",
    };
  } catch (error) {
    return failed(error, values);
  }
}

/* ---------- District association ---------- */

const MAX_FILE = 5 * 1024 * 1024;
const fileTypes = ["application/pdf", "image/jpeg", "image/png"];

const districtSchema = z.object({
  associationName: requiredText("Association name"),
  registrationNumber: requiredText("Registration number", 2, 60),
  state: stateSchema,
  district: requiredText("District"),
  contactPerson: requiredText("Contact person"),
  designation: requiredText("Designation"),
  phone: mobileSchema,
  email: z.email("Enter a valid email address"),
  address: requiredText("Full address", 10, 300),
  teamsCount: z.coerce.number({ message: "Enter a number" }).int().min(0, "Enter 0 or more").max(999),
  playersCount: z.coerce.number({ message: "Enter a number" }).int().min(0, "Enter 0 or more").max(99999),
});

export async function registerDistrict(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isBot(formData)) return { status: "success", reference: "district-ok" };
  const values = formValues(formData);
  const parsed = districtSchema.safeParse(values);
  const errors = parsed.success ? {} : toErrors(parsed.error);

  // Certificate: validate type and size, then store it in the private "certificates" bucket.
  const file = formData.get("certificate");
  let certificate: File | null = null;
  if (file instanceof File && file.size > 0) {
    if (!fileTypes.includes(file.type)) errors.certificate = "Upload a PDF, JPG or PNG";
    else if (file.size > MAX_FILE) errors.certificate = "The file must be 5 MB or smaller";
    else certificate = file;
  }

  if (!parsed.success || Object.keys(errors).length) {
    return { status: "error", message: "Please check the highlighted fields.", errors, values };
  }
  try {
    const { reference } = await saveDistrict(parsed.data, certificate);
    return {
      status: "success",
      reference,
      message: certificate
        ? `Your district association registration has been received with "${certificate.name}". SSCFI will verify the details and call you back.`
        : "Your district association registration has been received. SSCFI will verify the details, request the registration certificate by email and call you back.",
    };
  } catch (error) {
    return failed(error, values);
  }
}
