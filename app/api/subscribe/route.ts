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
    const kitError = await createRes.json().catch(() => null);
    console.error("[subscribe] subscriber_create_failed", createRes.status, kitError);
    return Response.json(
      { ok: false, error: "subscriber_create_failed", detail: kitError },
      { status: 502 }
    );
  }

  const createData = await createRes.json();
  const subscriber = createData.subscriber;

  if (!subscriber?.id) {
    console.error("[subscribe] no subscriber id in response", createData);
    return Response.json(
      { ok: false, error: "no_subscriber_id", detail: createData },
      { status: 502 }
    );
  }

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
    // Subscriber is already created in Kit with quiz_result field — log the
    // form-add failure but don't surface an error to the user.
    const kitError = await addRes.json().catch(() => null);
    console.error("[subscribe] form_add_failed (non-fatal)", addRes.status, kitError);
  }

  return Response.json({ ok: true });
}
