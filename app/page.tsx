'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import './styles.css';

export default function LandingPage() {
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    
    // Store in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('userName', name);
      sessionStorage.setItem('userEmail', email);
      
      // Route to assessment
      router.push('/assessment');
    }
  };

  return (
    <div className="wrap">
      {/* Topbar */}
      <div className="topbar">
        <div className="mark">Unbreakable Wealth</div>
        <div className="right">The Freedom Audit <span className="dot"></span> Open Now</div>
      </div>

      {/* Hero */}
      <header className="hero">
        <div className="fade overline">
          <span className="bar"></span>
          <span>A Diagnostic for the Already Successful</span>
          <span className="bar"></span>
        </div>
        <h1 className="fade title">The <span className="freedom">Freedom</span> Audit</h1>
        <p className="fade lede">Every personality test tells you who you are. None of them ask whether you're actually free.</p>
        <div className="fade rule"></div>
      </header>

      {/* Above First CTA */}
      <section className="col">
        <p className="fade">You already know this, deep down.</p>
        <p className="fade">You've climbed the mountain of success only to find yourself asking the question that haunts you, the one that shows up late at night when you finally stop long enough:</p>
      </section>

      <div className="pq fade"><q>Is this really it?</q></div>

      <section className="col">
        <p className="fade">You don't need more <em className="italic">insight</em>. Insight fails because it feels productive, but it gives you an out: <em className="italic">"This is just the way I am."</em></p>
        <p className="fade">Optimization is a different trap. The endless quest to optimize assumes that if you just fix your mindset, or your habits, or install a new morning routine, you'll be better. But you've tried all those things, and you always find the same answer. It doesn't work.</p>
        <p className="fade heavy">You've watched this cycle long enough to know something deeper is running.</p>
      </section>

      <div className="thesis fade">
        <span className="thesis-rule"></span>
        <p>The Freedom Audit reveals the <em>hidden operating structure</em> underneath the game.</p>
        <span className="thesis-rule"></span>
      </div>

      <section className="col">
        <p className="fade">You'll examine six dimensions of your life through 22 open-ended questions that can't be gamed like the standard multiple-choice. You don't fit in a box, so neither does this assessment.</p>
        <p className="fade">You'll get an extensive personalized report that connects patterns across your life you've sensed independently but never seen mapped together.</p>
      </section>

      <section className="reveal">
        <div className="fade pre">The result will reveal the truth you've been circling, codified by a single metric:</div>
        <div className="fade metric">
          <div className="label">Your</div>
          <div className="name">Alignment Score</div>
        </div>
        <div className="fade post">This is the precise gap between the life you say you want and the one you're actually living.</div>
      </section>

      <section className="col">
        <p className="fade">The answers may be uncomfortable.</p>
        <p className="fade lift">But once you see the architecture underneath the game, the game changes entirely.</p>
        <p className="fade aside" style={{marginTop: '32px'}}>The entire process takes 30–45 minutes. Radical self-honesty required.</p>
        <p className="fade aside">For best results, use voice-to-text to speak your answers out loud. Don't edit. Just be real.</p>
      </section>

      {/* Primary CTA */}
      <section className="cta-block">
        <form className="fade cta-form" id="landing-form" onSubmit={handleSubmit}>
          <div className="form-fields">
            <div className="field">
              <label htmlFor="user-name">First Name</label>
              <input type="text" id="user-name" name="name" placeholder="Your name" autoComplete="given-name" required />
            </div>
            <div className="field">
              <label htmlFor="user-email">Email Address</label>
              <input type="email" id="user-email" name="email" placeholder="you@example.com" autoComplete="email" required />
            </div>
          </div>
          <button type="submit" className="cta-btn">Take the Freedom Audit</button>
        </form>
      </section>

      <div className="below-divider"><span className="fade line"></span></div>

      <div className="pillar">
        <span className="fade eyebrow"><span className="num">I</span>What you'll examine</span>
        <h2 className="fade">Six dimensions of your <em>felt freedom</em>.</h2>
        <p className="fade subhead">The places where freedom is actually lived — or quietly forfeited — measured in your own words.</p>
      </div>

      <section className="dimensions">
        <div className="dim-grid">
          <div className="dim fade">
            <span className="roman">I · Health</span>
            <h3>Your <em>Vessel</em></h3>
            <p>Whether your body is built to sustain the life you have, or the life you're moving toward. The signals you've trained yourself to override.</p>
          </div>
          <div className="dim fade">
            <span className="roman">II · Relationships</span>
            <h3>Your <em>Mirrors</em></h3>
            <p>The people whose presence you optimize for. The truths you've learned not to say out loud. What that costs you, compounding.</p>
          </div>
          <div className="dim fade">
            <span className="roman">III · Time</span>
            <h3>Your <em>Sovereignty</em></h3>
            <p>Whose calendar your week is actually running on. The hours you can truly direct versus the ones quietly conscripted.</p>
          </div>
          <div className="dim fade">
            <span className="roman">IV · Mind</span>
            <h3>Your <em>Operating System</em></h3>
            <p>The old programs still running underneath the new awareness. The judgments louder than your clarity. The doubt that lives next to the knowing.</p>
          </div>
          <div className="dim fade">
            <span className="roman">V · Soul</span>
            <h3>Your <em>North Star</em></h3>
            <p>Whether the work you're doing now would still matter on the day none of it can be measured. The thing you'd defend if everything else were taken.</p>
          </div>
          <div className="dim fade">
            <span className="roman">VI · Financial</span>
            <h3>Your <em>Battery</em></h3>
            <p>Money is the resource that fuels freedom. The real question is whether you're actually converting.</p>
          </div>
        </div>
      </section>

      <div className="pillar" style={{marginTop: '120px'}}>
        <span className="fade eyebrow"><span className="num">II</span>What you'll receive</span>
        <h2 className="fade">A report written <em>specifically about you</em>.</h2>
        <p className="fade subhead">Generated from your own answers, cross-referenced across all six dimensions, and delivered as three artifacts.</p>
      </div>

      <section className="receive">
        <div className="receive-grid">
          <div className="deliverable fade">
            <span className="num">ONE</span>
            <h4>Your Metatype</h4>
            <div className="title">A name for the <em>shape of your life</em>.</div>
            <p>The pattern your answers reveal — the specific way your gifts and constraints are currently organized. The structural logic of how you're living right now.</p>
            <div className="sample">
              <span className="lab">Sample · Anonymized</span>
              You are someone who has touched real success and knows you can create again, but is living in a carefully managed container that both protects and constrains you…
            </div>
          </div>

          <div className="deliverable fade">
            <span className="num">TWO</span>
            <h4>The Gap</h4>
            <div className="title">Your <em>Alignment Score</em>.</div>
            <p>The precise distance between the life you say you want and the one your answers describe. Vision and Reality, mapped on a single axis. The number you cannot un-see.</p>
            <div className="gap-strip">
              <div className="row"><span>Reality</span><span>Vision</span></div>
              <div className="gap-bar">
                <div className="fill" style={{width: '92%'}}></div>
                <div className="g-span" style={{left: '68%', width: '24%'}}></div>
                <div className="r-mark" style={{left: '68%'}}></div>
                <div className="v-mark" style={{left: '92%'}}></div>
              </div>
              <div className="legend">
                <span><span className="num">6.8</span><span className="lab">Reality</span></span>
                <span><span className="num">2.4</span><span className="lab">Gap</span></span>
                <span><span className="num">9.2</span><span className="lab">Vision</span></span>
              </div>
            </div>
          </div>

          <div className="deliverable fade">
            <span className="num">THREE</span>
            <h4>Your Strategy</h4>
            <div className="title">The <em>one move</em> that cascades.</div>
            <p>The specific lever that, once pulled, reorganizes the rest. Drawn directly from the structure of your gap — and written in language you can actually act on.</p>
            <div className="sample">
              <span className="lab">Sample · Anonymized</span>
              The pattern that would cascade most powerfully across everything else is reclaiming full sovereignty without waiting for perfect conditions or complete certainty…
            </div>
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="fade kicker">You can keep <em className="italic">circling the question</em>.<br/>Or you can <span className="em">answer it</span>.</div>
        <form className="fade cta-form" onSubmit={handleSubmit}>
          <div className="form-fields">
            <div className="field">
              <label htmlFor="user-name-2">First Name</label>
              <input type="text" id="user-name-2" name="name" placeholder="Your name" autoComplete="given-name" required />
            </div>
            <div className="field">
              <label htmlFor="user-email-2">Email Address</label>
              <input type="email" id="user-email-2" name="email" placeholder="you@example.com" autoComplete="email" required />
            </div>
          </div>
          <button type="submit" className="cta-btn">Take the Freedom Audit</button>
        </form>
      </section>

      <footer>
        <div className="sig">An Unbreakable Wealth Tool <span className="dot"></span> Public Edition <span className="dot"></span> Your Responses Are Confidential</div>
      </footer>
    </div>
  );
}
