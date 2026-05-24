import { NextResponse } from "next/server";

type RsvpPayload = {
  name?: string;
  surname?: string;
  phone?: string;
  guestCount?: number;
  afterParty?: boolean;
  note?: string;
};

export async function POST(request: Request) {
  let payload: RsvpPayload;

  try {
    payload = (await request.json()) as RsvpPayload;
  } catch {
    return NextResponse.json({ message: "Geçersiz istek. Lütfen formu tekrar gönderin." }, { status: 400 });
  }

  const name = payload.name?.trim();
  const surname = payload.surname?.trim();
  const phone = payload.phone?.trim() ?? "";
  const note = payload.note?.trim() ?? "";
  const guestCount = Number(payload.guestCount);

  if (!name || !surname || !Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10) {
    return NextResponse.json({ message: "Lütfen tüm alanları doğru doldurun." }, { status: 400 });
  }

  const webhookUrl = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json({ message: "RSVP servisi henüz yapılandırılmadı." }, { status: 500 });
  }

  try {
    new URL(webhookUrl);
  } catch {
    return NextResponse.json({ message: "RSVP servisi doğru yapılandırılmadı." }, { status: 500 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        name,
        surname,
        phone,
        guestCount,
        afterParty: payload.afterParty ? "Evet" : "Hayır",
        note,
        source: "nikah-lcv-site",
        userAgent: request.headers.get("user-agent") ?? ""
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      return NextResponse.json({ message: "Davet yanıtı kaydedilemedi." }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ message: "Davet yanıtı kaydedilemedi." }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }

  return NextResponse.json({ message: "Davet yanıtınız alındı." });
}
