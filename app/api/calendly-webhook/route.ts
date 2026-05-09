import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Calendly webhook events
    // https://developer.calendly.com/api-docs/docs/webhook-events
    const event = payload.event;
    const eventType = payload.event_type;

    // Only process invitee.created or invitee.confirmed events
    if (!eventType || !eventType.startsWith('invitee.')) {
      return NextResponse.json({ received: true });
    }

    // Extract invitee email
    const inviteeEmail = payload.payload?.email || payload.payload?.invitee?.email;

    if (!inviteeEmail) {
      console.error('[calendly-webhook] No email found in payload:', payload);
      return NextResponse.json({ error: 'No email found' }, { status: 400 });
    }

    // Tag in Kit as "booking-confirmed"
    try {
      const response = await fetch('https://api.kit.com/v4/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Kit-Api-Key': process.env.KIT_API_SECRET!,
        },
        body: JSON.stringify({
          email_address: inviteeEmail,
          tags: ['booking-confirmed'],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('[calendly-webhook] Kit API error:', error);
      } else {
        console.log(`✅ Tagged ${inviteeEmail} as booking-confirmed`);
      }
    } catch (kitError) {
      console.error('[calendly-webhook] Kit tagging error:', kitError);
    }

    return NextResponse.json({ success: true, event: eventType, email: inviteeEmail });
  } catch (error) {
    console.error('[calendly-webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Calendly also sends GET requests to verify the webhook
export async function GET(req: NextRequest) {
  return NextResponse.json({ status: 'Calendly webhook endpoint active' });
}
