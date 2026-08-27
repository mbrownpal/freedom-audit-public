import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { email, clientName, currentQuestion, answers, report, status } = await req.json();

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Check if assessment exists for this email
    const { data: existingRows } = await supabase
      .from('assessments')
      .select('id')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1);
    
    const existing = existingRows && existingRows.length > 0 ? existingRows[0] : null;

    // Extract key fields from report (if complete)
    let metatype_name = null;
    let metatype_description = null;
    let gap_score = null;
    let vision_score = null;
    let reality_score = null;
    let lowest_pillar = null;

    if (status === 'complete' && report) {
      metatype_name = report.metatype_name || null;
      metatype_description = report.metatype_description || null;
      vision_score = parseFloat(report.alignment_score_vision) || null;
      reality_score = parseFloat(report.alignment_score_reality) || null;
      gap_score = vision_score && reality_score ? Math.max(0, vision_score - reality_score) : null;
      
      // Determine lowest pillar
      const pillars = [
        { name: 'Health', score: parseFloat(report.pillar_health) || 0 },
        { name: 'Relationships', score: parseFloat(report.pillar_relationships) || 0 },
        { name: 'Time', score: parseFloat(report.pillar_time) || 0 },
        { name: 'Mind', score: parseFloat(report.pillar_mind) || 0 },
        { name: 'Soul', score: parseFloat(report.pillar_soul) || 0 },
        { name: 'Finances', score: parseFloat(report.pillar_finances) || 0 },
      ];
      const lowestPillar = pillars.reduce((min, p) => p.score < min.score ? p : min);
      lowest_pillar = lowestPillar.name;
    }

    const payload = {
      email,
      client_name: clientName,
      current_question: currentQuestion,
      answers,
      report,
      status: status || 'in_progress',
      ...(status === 'complete' && { 
        completed_at: new Date().toISOString(),
        metatype_name,
        metatype_description,
        gap_score,
        vision_score,
        reality_score,
        lowest_pillar,
      }),
    };

    let result;
    if (existing) {
      // Update existing
      result = await supabase
        .from('assessments')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      // Insert new
      result = await supabase
        .from('assessments')
        .insert([payload])
        .select()
        .single();
    }

    if (result.error) {
      throw result.error;
    }

    // Tag in Kit when assessment is completed
    if (status === 'complete' && process.env.KIT_API_SECRET) {
      try {
        await fetch('https://api.kit.com/v4/subscribers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Kit-Api-Key': process.env.KIT_API_SECRET,
          },
          body: JSON.stringify({
            email_address: email,
            first_name: clientName,
            tags: ['freedom-audit-complete'],
          }),
        });
      } catch (kitError) {
        console.error('[API] Kit tagging error:', kitError);
        // Don't fail the whole save if Kit fails
      }
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('[API] Save error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Save failed' },
      { status: 500 }
    );
  }
}
