import { NextResponse } from "next/server";

type RsvpPayload = {
  name?: string;
  surname?: string;
  guestCount?: number;
  afterParty?: boolean;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as RsvpPayload;
  const name = payload.name?.trim();
  const surname = payload.surname?.trim();
  const guestCount = Number(payload.guestCount);

  if (!name || !surname || !Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10) {
    return NextResponse.json({ message: "Lütfen tüm alanları doğru doldurun." }, { status: 400 });
  }

  const webhookUrl = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json({ message: "RSVP servisi henüz yapılandırılmadı." }, { status: 500 });
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      name,
      surname,
      guestCount,
      afterParty: payload.afterParty ? "Evet" : "Hayır"
    })
  });

  if (!response.ok) {
    return NextResponse.json({ message: "Davet yanıtı kaydedilemedi." }, { status: 502 });
  }

  return NextResponse.json({ message: "Davet yanıtınız alındı." });
}
