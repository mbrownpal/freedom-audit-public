import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, name, report, answers } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Tag in Kit as "clicked-booking"
    try {
      await fetch('https://api.kit.com/v4/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Kit-Api-Key': process.env.KIT_API_SECRET!,
        },
        body: JSON.stringify({
          email_address: email,
          first_name: name,
          tags: ['clicked-booking'],
        }),
      });
    } catch (kitError) {
      console.error('[book-call] Kit tagging error:', kitError);
      // Continue even if Kit fails
    }

    // 2. Send report + answers to mike@mbrown.co (optional - only if report exists)
    if (report && answers) {
      try {
        await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/send-report`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientName: name,
            clientEmail: email,
            report,
            answers,
          }),
        });
      } catch (emailError) {
        console.error('[book-call] Email send error:', emailError);
        // Continue even if email fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[book-call] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process booking click', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
