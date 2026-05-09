import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface EmailData {
  name: string;
  email: string;
  metatype_name: string;
  metatype_description: string;
  gap_score: number;
  vision_score: number;
  reality_score: number;
  lowest_pillar: string;
  inner_state: string;
  the_gap: string;
}

const VOICE_SKILL = `
This is a SALES EMAIL with a coaching edge. Direct response. Confrontational. Creates urgency.

CORE PRINCIPLES:
1. Second person throughout - every sentence is "you" or "your"
2. Short paragraphs - 1-3 sentences max, lots of white space
3. No hedging - ban "maybe", "perhaps", "could", "might", "if you feel ready"
4. Confronting, not comforting - make them slightly uncomfortable
5. Use their exact audit data - be specific
6. Urgency via time - "What's the cost if nothing changes in 12 months?"

STRUCTURE:
- Opening: Reference their audit. Be specific.
- The Pattern: Name the wolf. Show the cost.
- The Bridge: Show what's possible.
- The Ask: Tell them what to do. No softness.
- The Urgency: Create time pressure.
- Close: "Here's the link when you are ready." + link + "• mb"

DO:
✅ "You've said", "You mentioned", "You constantly find yourself"
✅ "The wolf is installed in your subconscious"
✅ "This is where the work begins"
✅ "What's the cost if nothing changes?"
✅ Sign "• mb"

DON'T:
❌ "I've been thinking about how you..."
❌ "Maybe now is the time"
❌ "If you feel ready"
❌ Dense paragraphs
❌ Comfort them - confront them

Example opening:
"You've said you've built a beautiful life.

But the cost of vigilance is heavy. You constantly find yourself wondering if it can all be taken away.

You know, logically, that's not true.

But that doesn't keep the wolf at bay."
`;

const EDIT_SKILL = `
Fix ONLY these seven violations. Do not change anything else:

1. Negation constructions → delete negation clause, state only affirmative
2. Fragments → complete or merge
3. Triplets → break symmetry
4. Em dashes → replace with comma or restructure
5. Stacked short sentences → combine into one
6. "This is"/"That's"/"Here's" openers → rewrite
7. "the" where "your" or "this" fits → swap

Return the cleaned text only.
`;

export async function generateEmail(
  data: EmailData,
  emailNumber: number
): Promise<{ subject: string; body: string }> {
  
  // Email goals for each number in sequence
  const goals: Record<number, string> = {
    1: "Acknowledge what they shared. Show you understand their struggle. Make them feel seen. Reference specific details from their audit. Create connection before any ask.",
    2: "Reference their gap score and lowest pillar. Create urgency. Why haven't they booked yet? What's the cost of waiting?",
    3: "Challenge them directly. You see a pattern in their answers. Make it personal. What's holding them back?",
    4: "Share insight about their metatype. Connect it to their specific pain. Show them what's possible.",
    5: "Paint the vision of what life looks like on the other side of the gap. Make it tangible.",
    6: "Final call. After this, they're on their own. Direct but respectful."
  };

  const goal = goals[emailNumber] || goals[1];

  // Pass 1: Generate with voice skill
  const writePrompt = `You are Mike Brown, a high-performance coach.

Write a 150-word email to ${data.name}.

This is Email #${emailNumber} in a 6-email sequence following their Freedom Audit.

**Their data:**
- Metatype: ${data.metatype_name}
- Gap score: ${data.gap_score} (Vision: ${data.vision_score}, Reality: ${data.reality_score})
- Lowest pillar: ${data.lowest_pillar}
- Core struggle (reference one specific thing from this): ${data.inner_state.substring(0, 300)}

**Email #${emailNumber} goal:**
${goal}

**Voice instructions:**
${VOICE_SKILL}

**Structure:**
- Subject line (8 words max, no exclamation points)
- Body (150 words)
- CTA: ${emailNumber < 6 ? 'Soft invitation to book if ready' : 'Direct invitation to book'} (https://booking.berichnow.com)

Sign "— Mike"

Write the email now.`;

  const writeResponse = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: writePrompt }],
    temperature: 0.85,
  });

  const draftEmail = writeResponse.choices[0].message.content || '';

  // Pass 2: Edit with edit skill
  const editPrompt = `${EDIT_SKILL}

---

${draftEmail}`;

  const editResponse = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: editPrompt }],
    temperature: 0.3,
  });

  const cleanedEmail = editResponse.choices[0].message.content || '';

  // Parse subject and body
  const lines = cleanedEmail.split('\n').filter(l => l.trim());
  const subjectLine = lines.find(l => l.toLowerCase().startsWith('subject:'));
  const subject = subjectLine ? subjectLine.replace(/^subject:\s*/i, '').trim() : `Follow-up from your Freedom Audit`;
  
  // Body is everything after subject
  const subjectIndex = cleanedEmail.toLowerCase().indexOf('subject:');
  const bodyStart = cleanedEmail.indexOf('\n', subjectIndex) + 1;
  const body = cleanedEmail.substring(bodyStart).trim();

  return { subject, body };
}
