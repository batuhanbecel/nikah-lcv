import { NextRequest, NextResponse } from 'next/server'

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL ?? ''

export async function POST(request: NextRequest) {
  if (!APPS_SCRIPT_URL) {
    return NextResponse.json({ success: false, message: 'APPS_SCRIPT_URL not configured' }, { status: 500 })
  }

  try {
    const body = await request.json()

    const gasRes = await fetch(APPS_SCRIPT_URL, {
      method:   'POST',
      redirect: 'follow',
      headers:  { 'Content-Type': 'text/plain;charset=UTF-8' },
      body:     JSON.stringify(body),
    })

    const text = await gasRes.text()

    try {
      return NextResponse.json(JSON.parse(text))
    } catch {
      // Apps Script returned non-JSON — treat as success if HTTP was ok
      return NextResponse.json({ success: gasRes.ok })
    }
  } catch (err) {
    return NextResponse.json({ success: false, message: String(err) }, { status: 500 })
  }
}
