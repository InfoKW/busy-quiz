import type { ResultType } from "@/lib/results";

export async function POST(req: Request) {
  const { email, resultType }: { email: string; resultType: ResultType } =
    await req.json();

  const API_KEY = process.env.KIT_API_KEY;
  const FORM_ID = process.env.KIT_FORM_ID;

  if (!API_KEY || !FORM_ID) {
    return Response.json(
      { ok: false, error: "server_misconfigured" },
      { status: 500 }
    );
  }

  if (!email || !resultType) {
    return Response.json(
      { ok: false, error: "missing_fields" },
      { status: 400 }
    );
  }

  // 1. Create or upsert subscriber, store quiz_result custom field.
  //    NOTE: the 'quiz_result' custom field must exist in Kit before this runs
  //    (Subscribers → custom field → add 'quiz_result') — Kit silently drops
  //    unknown field keys with no error.
  const createRes = await fetch("https://api.kit.com/v4/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Kit-Api-Key": API_KEY,
    },
    body: JSON.stringify({
      email_address: email,
      fields: { quiz_result: resultType },
    }),
  });

  if (!createRes.ok) {
    return Response.json(
      { ok: false, error: "subscriber_create_failed" },
      { status: 502 }
    );
  }

  const { subscriber } = await createRes.json();

  // 2. Add to the quiz form so form-based automations fire.
  const addRes = await fetch(
    `https://api.kit.com/v4/forms/${FORM_ID}/subscribers/${subscriber.id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Kit-Api-Key": API_KEY,
      },
      body: JSON.stringify({ referrer: process.env.NEXT_PUBLIC_SITE_URL ?? "" }),
    }
  );

  if (!addRes.ok) {
    return Response.json(
      { ok: false, error: "form_add_failed" },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
