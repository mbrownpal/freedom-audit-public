// Add this TabPanel function BEFORE the Report function in assessment/page.tsx

function TabPanel({ id, report }: any) {
  switch (id) {
    case 'metatype':
      return (
        <div className="fa-tab-panel">
          <div className="metatype-title">{report.metatype_name}</div>
          <Paragraphs text={report.metatype_description} />
        </div>
      );
    case 'health':
      return (
        <div className="fa-tab-panel">
          <h2>Freedom of Health</h2>
          <Paragraphs text={report.pillar_health} />
        </div>
      );
    case 'relationships':
      return (
        <div className="fa-tab-panel">
          <h2>Freedom of Relationships</h2>
          <Paragraphs text={report.pillar_relationships} />
        </div>
      );
    case 'time':
      return (
        <div className="fa-tab-panel">
          <h2>Freedom of Time</h2>
          <Paragraphs text={report.pillar_time} />
        </div>
      );
    case 'mind':
      return (
        <div className="fa-tab-panel">
          <h2>Freedom of Mind</h2>
          <Paragraphs text={report.pillar_mind} />
        </div>
      );
    case 'soul':
      return (
        <div className="fa-tab-panel">
          <h2>Freedom of Soul</h2>
          <Paragraphs text={report.pillar_soul} />
        </div>
      );
    case 'finances':
      return (
        <div className="fa-tab-panel">
          <h2>Financial Foundation</h2>
          <Paragraphs text={report.pillar_finances} />
        </div>
      );
    case 'inner':
      return (
        <div className="fa-tab-panel">
          <h2>Your Inner State</h2>
          <Paragraphs text={report.inner_state} />
          <div className="fa-divider" />
          <Paragraphs text={report.patterns} />
        </div>
      );
    case 'gap':
      return (
        <div className="fa-tab-panel">
          <h2>The Gap</h2>
          <GapVisual
            vision={report.alignment_score_vision}
            reality={report.alignment_score_reality}
          />
          <Paragraphs text={report.the_gap_narrative} />
        </div>
      );
    case 'strategy':
      return (
        <div className="fa-tab-panel">
          <h2>Your Strategy</h2>
          <Paragraphs text={report.strategy} />
        </div>
      );
    default:
      return null;
  }
}

// REPLACE the entire Report function with this:

function Report({ clientName, report, onRestart }: any) {
  const [active, setActive] = useState('metatype');

  const handleDownload = () => {
    const htmlContent = generateReportHTML(clientName, report);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freedom-audit-${clientName.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReportHTML = (name: string, rpt: any) => {
    const vision = Number(rpt.alignment_score_vision) || 0;
    const reality = Number(rpt.alignment_score_reality) || 0;
    const gap = Math.max(0, vision - reality).toFixed(1);
    
    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Freedom Audit - ${name}</title>
<style>* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Georgia, 'Times New Roman', serif; color: #1a1815; background: #fff; line-height: 1.8; padding: 80px 64px; max-width: 800px; margin: 0 auto; }
.cover { text-align: center; padding: 120px 0; border-bottom: 2px solid #B87333; margin-bottom: 80px; }
.eyebrow { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; letter-spacing: 2px; color: #B87333; margin-bottom: 40px; }
h1 { font-size: 56px; font-weight: 400; margin-bottom: 20px; }
.client-name { font-style: italic; font-size: 20px; color: #B87333; margin-top: 40px; }
.date { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #655d52; margin-top: 20px; }
.section { page-break-inside: avoid; margin-bottom: 80px; }
.section-title { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10px; letter-spacing: 2px; color: #B87333; margin-bottom: 12px; }
.section h2 { font-size: 32px; font-weight: 400; margin-bottom: 24px; }
.metatype-name { font-style: italic; color: #B87333 !important; font-size: 36px !important; }
.gap-scores { font-size: 13px; color: #655d52; text-align: center; margin-bottom: 32px; padding: 16px; background: #f7f2ea; border-radius: 4px; }
.section-content p { font-size: 16px; line-height: 1.8; margin-bottom: 24px; }
@media print { body { padding: 40px; } .section { page-break-before: always; } }</style></head><body>
<div class="cover"><div class="eyebrow">THE FREEDOM AUDIT</div><h1>Your Report</h1>
<div class="client-name">Prepared for ${name}</div><div class="date">${new Date().toLocaleDateString()}</div></div>
<div class="section"><div class="section-title">YOUR METATYPE</div><h2 class="metatype-name">${rpt.metatype_name}</h2>
<div class="section-content">${rpt.metatype_description.split(/\n{2,}/).map((p: string) => `<p>${p.trim()}</p>`).join('')}</div></div>
<div class="section"><div class="section-title">FREEDOM OF HEALTH</div><h2>Freedom of Health</h2>
<div class="section-content">${rpt.pillar_health.split(/\n{2,}/).map((p: string) => `<p>${p.trim()}</p>`).join('')}</div></div>
<div class="section"><div class="section-title">FREEDOM OF RELATIONSHIPS</div><h2>Freedom of Relationships</h2>
<div class="section-content">${rpt.pillar_relationships.split(/\n{2,}/).map((p: string) => `<p>${p.trim()}</p>`).join('')}</div></div>
<div class="section"><div class="section-title">FREEDOM OF TIME</div><h2>Freedom of Time</h2>
<div class="section-content">${rpt.pillar_time.split(/\n{2,}/).map((p: string) => `<p>${p.trim()}</p>`).join('')}</div></div>
<div class="section"><div class="section-title">FREEDOM OF MIND</div><h2>Freedom of Mind</h2>
<div class="section-content">${rpt.pillar_mind.split(/\n{2,}/).map((p: string) => `<p>${p.trim()}</p>`).join('')}</div></div>
<div class="section"><div class="section-title">FREEDOM OF SOUL</div><h2>Freedom of Soul</h2>
<div class="section-content">${rpt.pillar_soul.split(/\n{2,}/).map((p: string) => `<p>${p.trim()}</p>`).join('')}</div></div>
<div class="section"><div class="section-title">FINANCIAL FOUNDATION</div><h2>Financial Foundation</h2>
<div class="section-content">${rpt.pillar_finances.split(/\n{2,}/).map((p: string) => `<p>${p.trim()}</p>`).join('')}</div></div>
<div class="section"><div class="section-title">YOUR INNER STATE</div><h2>Your Inner State</h2>
<div class="section-content">${(rpt.inner_state + '\n\n' + rpt.patterns).split(/\n{2,}/).map((p: string) => `<p>${p.trim()}</p>`).join('')}</div></div>
<div class="section"><div class="section-title">THE GAP</div><h2>The Gap</h2>
<div class="gap-scores">Vision: ${vision.toFixed(1)} | Gap: ${gap} | Reality: ${reality.toFixed(1)}</div>
<div class="section-content">${rpt.the_gap_narrative.split(/\n{2,}/).map((p: string) => `<p>${p.trim()}</p>`).join('')}</div></div>
<div class="section"><div class="section-title">YOUR STRATEGY</div><h2>Your Strategy</h2>
<div class="section-content">${rpt.strategy.split(/\n{2,}/).map((p: string) => `<p>${p.trim()}</p>`).join('')}</div></div>
</body></html>`;
  };

  const TABS = [
    { id: 'metatype', label: 'Your Metatype' },
    { id: 'health', label: 'Health' },
    { id: 'relationships', label: 'Relationships' },
    { id: 'time', label: 'Time' },
    { id: 'mind', label: 'Mind' },
    { id: 'soul', label: 'Soul' },
    { id: 'finances', label: 'Finances' },
    { id: 'inner', label: 'Inner State' },
    { id: 'gap', label: 'The Gap' },
    { id: 'strategy', label: 'Strategy' },
  ];

  return (
    <div className="fa-shell">
      <div className="fa-report-head">
        <div className="eyebrow">The Freedom Audit</div>
        <h1>Your Report</h1>
        <div className="fa-rule" />
        <div className="name">Prepared for {clientName}</div>
      </div>

      <div className="fa-tabs">
        <div className="fa-tabs-scroll">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`fa-tab ${active === t.id ? 'active' : ''}`}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <TabPanel id={active} report={report} />

      <div className="fa-report-footer">
        <div className="mark">End of Report · Unbreakable Wealth</div>
        <div className="actions">
          <button className="fa-btn" onClick={handleDownload}>Download Report</button>
          <button className="fa-btn fa-btn-ghost" onClick={onRestart}>Start Over</button>
        </div>
      </div>
    </div>
  );
}
