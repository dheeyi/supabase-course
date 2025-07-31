import { NextResponse } from 'next/server';
import { createProfile } from '@/app/login/actions.ts';

export async function GET() {
  await createProfile();
  return NextResponse.json({ success: true });
}