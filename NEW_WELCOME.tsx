function Welcome({ clientName, clientEmail, onName, onEmail, onBegin }: any) {
  const canBegin = clientName.trim().length > 0 && clientEmail.trim().length > 0;
  
  return (
    <div className="fa-welcome">
      <div className="fa-welcome-inner">
        <h1>The <em>Freedom</em> Audit</h1>
        <p className="lede">Most people are far wealthier than they realize—and far less free.</p>
        <div className="fa-rule" />
        
        <div className="body">
          <p>
            You've done what you were supposed to do. You've worked hard. You've built something. Maybe you've hit the numbers you thought mattered.
          </p>
          
          <p>
            And yet.
          </p>
          
          <p style={{textAlign: "center", fontStyle: "italic", margin: "2rem auto", fontSize: "1.1em"}}>
            Is this really it?
          </p>
          
          <p>
            That question—quiet, persistent, uncomfortable—is the signal. It's not a sign of failure. It's a sign you're ready for something real.
          </p>
          
          <p>
            The Freedom Audit isn't another personality test. It's not going to tell you what color you are or what archetype fits. This is a mirror. A map. A way to see, clearly and honestly, where you actually stand across the dimensions that determine whether your life feels like yours.
          </p>
          
          <p style={{textAlign: "center", fontWeight: 600, margin: "1.5rem auto"}}>
            Health. Relationships. Time. Mind. Soul. Money.
          </p>
          
          <p>
            Not as aspirations. As <em>current reality</em>.
          </p>
          
          <p>
            This takes 60–75 minutes. It's 22 questions, but they're the ones that matter. The ones you've been avoiding. The ones that, when answered honestly, change everything.
          </p>
          
          <p>
            You'll get a personalized report that doesn't just diagnose—it shows you the gap between where you are and where you're capable of being. And more importantly, it gives you a strategy for closing it.
          </p>
          
          <p style={{textAlign: "center", fontWeight: 600, fontStyle: "italic"}}>
            This is for people who've already won the game they were playing—
            <br/>and are finally ready to admit it wasn't the right game.
          </p>
          
          <p>
            If you're here, you don't need more tactics. You need clarity. You need to know what's actually true. You need to stop pretending.
          </p>
          
          <p>
            So let's find out.
          </p>
        </div>

        <div className="fa-input-grid">
          <div className="fa-input-col">
            <span className="fa-input-label">First Name</span>
            <input
              className="fa-name-input"
              type="text"
              value={clientName}
              onChange={(e) => onName(e.target.value)}
              placeholder="First name"
              autoComplete="given-name"
            />
          </div>
          <div className="fa-input-col">
            <span className="fa-input-label">Email Address</span>
            <input
              className="fa-name-input"
              type="email"
              value={clientEmail}
              onChange={(e) => onEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="meta">{TOTAL_QUESTIONS} questions · 10 sections</div>
        <button className="fa-btn" onClick={onBegin} disabled={!canBegin}>
          Begin the Audit
        </button>
      </div>
    </div>
  );
}
