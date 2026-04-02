import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set('demo_session', 'ok', {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24, // 24 h
    sameSite: 'lax',
  })
  return response
}
