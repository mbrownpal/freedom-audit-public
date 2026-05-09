import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateEmail } from '@/lib/generate-email';

const resend = new Resend(process.env.RESEND_API_KEY);

// Blacklist: never send to existing clients
const BLACKLIST = [
  'danny@physicaltherapybiz.com',
  'bryan@bbsanchez.com',
  'divyabrown@gmail.com',
  'kimberly@mbrown.co',
];

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      email,
      metatype_name,
      metatype_description,
      gap_score,
      vision_score,
      reality_score,
      lowest_pillar,
      inner_state,
      the_gap,
      email_number,
    } = await req.json();

    // Safety check: never send to blacklisted emails
    if (BLACKLIST.includes(email.toLowerCase())) {
      console.log(`[send-sequence-email] Skipping blacklisted email: ${email}`);
      return NextResponse.json({ 
        success: false, 
        reason: 'blacklisted',
        message: 'Email is on the blacklist (existing client)'
      });
    }

    // Generate email using two-pass system
    const { subject, body } = await generateEmail(
      {
        name,
        email,
        metatype_name,
        metatype_description,
        gap_score: parseFloat(gap_score),
        vision_score: parseFloat(vision_score),
        reality_score: parseFloat(reality_score),
        lowest_pillar,
        inner_state,
        the_gap,
      },
      email_number
    );

    // Send via Resend
    await resend.emails.send({
      from: 'Mike Brown <mike@unbreakablewealth.com>',
      replyTo: 'mike@mbrown.co',
      to: email,
      subject,
      html: body.replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>'),
    });

    console.log(`✅ Sent Email #${email_number} to ${email}`);

    return NextResponse.json({ 
      success: true, 
      email_number,
      subject,
      preview: body.substring(0, 100) + '...'
    });
  } catch (error) {
    console.error('[send-sequence-email] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
