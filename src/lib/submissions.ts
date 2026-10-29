import { randomInt } from "node:crypto";
import { stateCodes, type IndianState } from "@/lib/forms";
import { hasSupabaseAdmin, supabaseAdmin } from "@/lib/supabase/server";

/**
 * Every form submission lands here. With Supabase configured the row is stored (and the certificate uploaded);
 * without it (a preview without keys) the submission is logged on the server so nothing is silently lost.
 * Email notifications are added when RESEND_API_KEY exists.
 */

export class SubmissionError extends Error {}

function makeReference(prefix: string) {
  const time = Date.now().toString(36).toUpperCase();
  const salt = randomInt(0, 36 ** 3).toString(36).padStart(3, "0").toUpperCase();
  return `${prefix}-${time}${salt}`;
}

/** +91XXXXXXXXXX from any accepted form (+91…, 0…, bare ten digits, spaces or dashes). */
export function normaliseMobile(value: string) {
  const digits = value.replace(/[\s-]/g, "").replace(/^(\+91|0)/, "");
  return `+91${digits}`;
}

async function store(kind: string, prefix: string, write: (reference: string) => Promise<void>) {
  const reference = makeReference(prefix);
  if (!hasSupabaseAdmin) {
    console.info(`[sscfi] ${kind} ${reference} (Supabase not configured, logged only)`);
    return { reference };
  }
  try {
    await write(reference);
  } catch (error) {
    console.error(`[sscfi] ${kind} ${reference} failed`, error);
    throw new SubmissionError("We could not save your submission. Please try again in a moment.");
  }
  return { reference };
}

function must(result: { error: { message: string } | null }) {
  if (result.error) throw new Error(result.error.message);
}

/* ---------- Enquiry ---------- */

export async function saveEnquiry(input: {
  name: string;
  mobile: string;
  email: string;
  type: string;
  role?: string;
  message: string;
}) {
  return store("enquiry", "ENQ", async (reference) => {
    must(
      await supabaseAdmin().from("enquiries").insert({
        reference,
        name: input.name,
        mobile: normaliseMobile(input.mobile),
        email: input.email.toLowerCase(),
        type: input.type,
        role: input.role || null,
        message: input.message,
      }),
    );
  });
}

/* ---------- Player ---------- */

const battingMap: Record<string, string> = { "Right-hand": "right", "Left-hand": "left" };

export async function savePlayer(input: {
  fullName: string;
  guardianName: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
  address: string;
  pincode: string;
  city: string;
  state: IndianState;
  category: string;
  battingStyle: string;
  bowlingStyle: string;
  club?: string;
  guardianConsent: boolean;
}) {
  return store("player", "PLR", async (reference) => {
    must(
      await supabaseAdmin().from("players").insert({
        reference,
        full_name: input.fullName,
        guardian_name: input.guardianName,
        email: input.email.toLowerCase(),
        mobile: normaliseMobile(input.mobile),
        dob: input.dob,
        gender: input.gender.toLowerCase(),
        address: input.address,
        pincode: input.pincode,
        city: input.city,
        state_code: stateCodes[input.state],
        category: input.category.toLowerCase(),
        batting_style: battingMap[input.battingStyle] ?? input.battingStyle.toLowerCase(),
        bowling_style: input.bowlingStyle.toLowerCase(),
        club: input.club || null,
        guardian_consent: input.guardianConsent,
      }),
    );
  });
}

/* ---------- Team / club ---------- */

export async function saveTeam(input: {
  teamName: string;
  city: string;
  state: IndianState;
  captainName: string;
  captainMobile: string;
  viceCaptainName: string;
  squad: string[];
  coachName: string;
  coachContact: string;
  previousTournaments?: string;
}) {
  return store("team", "TEAM", async (reference) => {
    must(
      await supabaseAdmin().from("teams").insert({
        reference,
        team_name: input.teamName,
        city: input.city,
        state_code: stateCodes[input.state],
        captain_name: input.captainName,
        captain_mobile: normaliseMobile(input.captainMobile),
        vice_captain_name: input.viceCaptainName,
        squad: input.squad,
        coach_name: input.coachName,
        coach_contact: normaliseMobile(input.coachContact),
        previous_tournaments: input.previousTournaments || null,
      }),
    );
  });
}

/* ---------- District association ---------- */

export async function saveDistrict(
  input: {
    associationName: string;
    registrationNumber: string;
    state: IndianState;
    district: string;
    contactPerson: string;
    designation: string;
    phone: string;
    email: string;
    address: string;
    teamsCount: number;
    playersCount: number;
  },
  certificate: File | null,
) {
  return store("district", "DIST", async (reference) => {
    const db = supabaseAdmin();
    const stateCode = stateCodes[input.state];

    // Link to a seeded district when the name matches, so an approval can recolour the map.
    const { data: district } = await db
      .from("districts")
      .select("id")
      .eq("state_code", stateCode)
      .ilike("name", input.district.trim())
      .maybeSingle();

    let certificatePath: string | null = null;
    if (certificate) {
      const safeName = certificate.name.replace(/[^\w.-]+/g, "_").slice(-80);
      certificatePath = `associations/${reference}/${safeName}`;
      const upload = await db.storage
        .from("certificates")
        .upload(certificatePath, await certificate.arrayBuffer(), { contentType: certificate.type, upsert: false });
      if (upload.error) throw new Error(upload.error.message);
    }

    must(
      await db.from("associations").insert({
        reference,
        association_name: input.associationName,
        registration_number: input.registrationNumber,
        state_code: stateCode,
        district_name: input.district,
        district_id: district?.id ?? null,
        contact_person: input.contactPerson,
        designation: input.designation,
        phone: normaliseMobile(input.phone),
        email: input.email.toLowerCase(),
        address: input.address,
        teams_count: input.teamsCount,
        players_count: input.playersCount,
        certificate_path: certificatePath,
        certificate_name: certificate?.name ?? null,
        certificate_size: certificate?.size ?? null,
        certificate_type: certificate?.type ?? null,
      }),
    );
  });
}

/* ---------- Newsletter ---------- */

export async function saveSubscriber(email: string) {
  const address = email.toLowerCase();
  if (!hasSupabaseAdmin) {
    console.info(`[sscfi] subscriber ${address} (Supabase not configured, logged only)`);
    return { alreadySubscribed: false };
  }
  const { data, error } = await supabaseAdmin().from("subscribers").select("status").eq("email", address).maybeSingle();
  if (error) throw new SubmissionError("We could not save your email. Please try again in a moment.");
  if (data?.status === "confirmed" || data?.status === "pending") return { alreadySubscribed: true };

  const upsert = await supabaseAdmin()
    .from("subscribers")
    .upsert({ email: address, status: "pending", unsubscribed_at: null }, { onConflict: "email" });
  if (upsert.error) throw new SubmissionError("We could not save your email. Please try again in a moment.");
  return { alreadySubscribed: false };
}
