'use client';

import { useState, useReducer, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AutoTextarea, Paragraphs, GapVisual } from '../components';
import '../assessment.css';

// Questions from prototype
const QUESTIONS = [
  { section: 'Where You Are Now', question: "How would you describe yourself and the season of life you're in right now?" },
  { section: 'Where You Are Now', question: "If we fast-forward 12 months and this next chapter has gone really well, what's different about your life?" },
  { section: 'Freedom of Health', question: "On a scale of 0-10, how do you feel about your health right now? What's working, and what's not where you'd like it to be?" },
  { section: 'Freedom of Relationships', question: 'On a scale of 0-10, how would you rate your relationships right now? Think about your partner, your family, your closest friends, and your broader community. Where do you feel most yourself, and where are you still guarding?' },
  { section: 'Freedom of Relationships', question: "Where in your life do you feel most free to be exactly who you are without editing? Where do you feel like you're still wearing a version of yourself that isn't quite true?" },
  { section: 'Freedom of Time', question: 'On a scale of 0-10, how free do you feel with your time? Walk me through how you actually spend your days. How much is chosen versus reactive?' },
  { section: 'Freedom of Mind', question: 'On a scale of 0-10, how clear and free does your mind feel on most days? Is your work energizing or draining? When during the day do you feel most like yourself?' },
  { section: 'Freedom of Mind', question: "What beliefs or stories are you carrying that you suspect aren't fully true anymore?" },
  { section: 'Freedom of Soul', question: 'On a scale of 0-10, how connected do you feel to something greater than yourself? How aligned is your work with a deeper sense of purpose? What does that even look like for you?' },
  { section: 'Financial Foundation', question: "On a scale of 0-10, how do you rate your financial situation? What's going well, and what's not where you'd like it to be?" },
  { section: 'Financial Foundation', question: "What does 'enough' look like for you, specifically? Have you ever actually defined the number?" },
  { section: 'Your Inner Landscape', question: 'When something stressful or painful happens, what goes on inside you? How does it hit, how long does it stick around, and how do you move through it?' },
  { section: 'Your Inner Landscape', question: "When you want something you don't have, how does that land? Does it drive you, distract you, or sit with you in some other way?" },
  { section: 'Your Inner Landscape', question: "How much of your day are you genuinely present versus running on autopilot or stuck in your head about what's next?" },
  { section: 'Your Inner Landscape', question: "When everything gets quiet and you're really honest with yourself, what's the undercurrent? What's running in the background?" },
  { section: 'Where It Comes From', question: "What did you witness from your father's relationship to work, money, and life? How does that show up in you today?" },
  { section: 'Where It Comes From', question: "What did you witness from your mother's relationship to work, money, and life? How does that show up in you today?" },
  { section: 'Where It Comes From', question: "What's a pattern you've identified in yourself that you've tried to change but can't quite shake? What keeps it in place?" },
  { section: 'Where It Comes From', question: 'What role did you play in your family growing up? Are you still playing some version of it?' },
  { section: 'Radical Honesty', question: 'What are you pretending not to know about your life right now?' },
  { section: 'Radical Honesty', question: 'What are you most afraid of losing if you actually got everything you say you want?' },
  { section: 'Radical Honesty', question: "If money, status, and other people's opinions were completely off the table, what would you do with the next ten years of your life?" },
];

const TOTAL_QUESTIONS = QUESTIONS.length;

const GEN_MESSAGES = [
  'Mapping your inner terrain…',
  'Reading between the lines…',
  'Synthesizing patterns…',
  'Calculating your Alignment Score…',
  'Generating your report…',
];

const initialState = {
  mode: 'assessment' as 'assessment' | 'generating' | 'report',
  clientName: '',
  clientEmail: '',
  currentQuestion: 0,
  answers: {} as Record<number, string>,
  report: null as any,
  error: null as string | null,
};

type State = typeof initialState;
type Action =
  | { type: 'SET_NAME'; value: string }
  | { type: 'SET_EMAIL'; value: string }
  | { type: 'ANSWER'; index: number; value: string }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'GENERATE' }
  | { type: 'REPORT_SUCCESS'; report: any }
  | { type: 'REPORT_ERROR'; error: string | null }
  | { type: 'RESTART' }
  | { type: 'HYDRATE'; payload: Partial<State> };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, clientName: action.value };
    case 'SET_EMAIL':
      return { ...state, clientEmail: action.value };
    case 'ANSWER':
      return {
        ...state,
        answers: { ...state.answers, [action.index]: action.value },
      };
    case 'NEXT':
      if (state.currentQuestion >= TOTAL_QUESTIONS - 1) return state;
      return { ...state, currentQuestion: state.currentQuestion + 1 };
    case 'BACK':
      if (state.currentQuestion <= 0) return state;
      return { ...state, currentQuestion: state.currentQuestion - 1 };
    case 'GENERATE':
      return { ...state, mode: 'generating', error: null };
    case 'REPORT_SUCCESS':
      return { ...state, mode: 'report', report: action.report, error: null };
    case 'REPORT_ERROR':
      return { ...state, error: action.error };
    case 'RESTART':
      return initialState;
    case 'HYDRATE':
      return {
        ...initialState,
        ...action.payload,
        error: null,
        mode: action.payload.mode === 'generating' ? 'assessment' : (action.payload.mode || 'assessment'),
      };
    default:
      return state;
  }
}

export default function FreedomAudit() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [resumePrompt, setResumePrompt] = useState<Partial<State> | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  // Read from sessionStorage on mount
  useEffect(() => {
    const name = sessionStorage.getItem('userName');
    const email = sessionStorage.getItem('userEmail');
    
    if (!name || !email) {
      // No session data → redirect to landing
      router.push('/');
      return;
    }
    
    dispatch({ type: 'SET_NAME', value: name });
    dispatch({ type: 'SET_EMAIL', value: email });
    setSessionLoaded(true);
  }, [router]);

  // Load saved state once email is set
  useEffect(() => {
    if (!sessionLoaded || !state.clientEmail) return;
    
    fetch('/api/assessment/load', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: state.clientEmail }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data && Object.keys(data.data.answers || {}).length > 0) {
          setResumePrompt(data.data);
        }
      })
      .catch(console.error);
  }, [sessionLoaded, state.clientEmail]);

  // Auto-save
  useEffect(() => {
    if (state.mode === 'generating' || !state.clientEmail || !sessionLoaded) return;

    const saveData = {
      email: state.clientEmail,
      clientName: state.clientName,
      currentQuestion: state.currentQuestion,
      answers: state.answers,
      report: state.report,
      status: state.mode === 'report' ? 'complete' : 'in_progress',
    };

    fetch('/api/assessment/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saveData),
    }).catch(console.error);
  }, [state, state.mode, sessionLoaded]);

  const runGeneration = useCallback(async () => {
    try {
      const answersArray = QUESTIONS.map((q, i) => ({
        section: q.section,
        question: q.question,
        answer: state.answers[i] || '',
      }));

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: state.clientName,
          clientEmail: state.clientEmail,
          answers: answersArray,
        }),
      });

      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      dispatch({ type: 'REPORT_SUCCESS', report: data.report });
    } catch (err: any) {
      dispatch({ type: 'REPORT_ERROR', error: err.message || 'Something went wrong' });
    }
  }, [state.clientName, state.clientEmail, state.answers]);

  const handleNext = useCallback(() => {
    if (state.currentQuestion >= TOTAL_QUESTIONS - 1) {
      dispatch({ type: 'GENERATE' });
      runGeneration();
    } else {
      dispatch({ type: 'NEXT' });
    }
  }, [state.currentQuestion, runGeneration]);

  const handleBack = useCallback(() => {
    dispatch({ type: 'BACK' });
  }, []);

  const handleAnswer = useCallback((value: string) => {
    dispatch({ type: 'ANSWER', index: state.currentQuestion, value });
  }, [state.currentQuestion]);

  const handleRestart = useCallback(() => {
    if (confirm('Are you sure? This will clear all your answers and start over.')) {
      sessionStorage.removeItem('userName');
      sessionStorage.removeItem('userEmail');
      router.push('/');
    }
  }, [router]);

  const handleResume = useCallback(() => {
    if (resumePrompt) {
      dispatch({ type: 'HYDRATE', payload: resumePrompt });
      setResumePrompt(null);
    }
  }, [resumePrompt]);

  const handleStartFresh = useCallback(() => {
    setResumePrompt(null);
  }, []);

  if (!sessionLoaded) {
    return (
      <div className="fa-root">
        <div className="fa-loading">Loading...</div>
      </div>
    );
  }

  if (resumePrompt) {
    return (
      <div className="fa-root">
        <div className="fa-resume-prompt">
          <h2>Welcome back, {state.clientName}!</h2>
          <p>You have a saved assessment in progress.</p>
          <div className="fa-resume-actions">
            <button className="fa-btn" onClick={handleResume}>
              Resume
            </button>
            <button className="fa-btn-secondary" onClick={handleStartFresh}>
              Start Fresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.mode === 'assessment') {
    const q = QUESTIONS[state.currentQuestion];
    const answer = state.answers[state.currentQuestion] || '';
    const canProceed = answer.trim().length > 0;

    return (
      <div className="fa-root">
        <ProgressBar
          current={state.currentQuestion}
          total={TOTAL_QUESTIONS}
          sectionTitle={q.section}
        />
        <div className="fa-question-panel">
          <div className="fa-question-inner">
            <div className="fa-question-section">{q.section}</div>
            <div className="fa-question-text">{q.question}</div>
            <AutoTextarea
              value={answer}
              onChange={handleAnswer}
              placeholder="Type your answer here…"
              id={`q-${state.currentQuestion}`}
              autoFocus
            />
            <div className="fa-question-actions">
              {state.currentQuestion > 0 && (
                <button className="fa-btn-secondary" onClick={handleBack}>
                  Back
                </button>
              )}
              <button
                className="fa-btn"
                onClick={handleNext}
                disabled={!canProceed}
              >
                {state.currentQuestion >= TOTAL_QUESTIONS - 1 ? 'Generate Report' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.mode === 'generating') {
    return (
      <div className="fa-root">
        <Generating />
      </div>
    );
  }

  if (state.mode === 'report' && state.report) {
    return (
      <div className="fa-root">
        <Report report={state.report} clientName={state.clientName} onRestart={handleRestart} />
      </div>
    );
  }

  return null;
}

function ProgressBar({ current, total, sectionTitle }: any) {
  const pct = ((current + 1) / total) * 100;
  return (
    <div className="fa-progress-wrap">
      <div className="fa-progress-inner">
        <div className="fa-progress-meta">
          <span className="fa-progress-section">{sectionTitle}</span>
          <span className="fa-progress-count">
            {current + 1} of {total}
          </span>
        </div>
        <div className="fa-progress-track">
          <div className="fa-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

function Generating() {
  const [msgIndex, setMsgIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % GEN_MESSAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fa-generating">
      <div className="fa-generating-inner">
        <div className="fa-generating-spinner" />
        <div className="fa-generating-text">{GEN_MESSAGES[msgIndex]}</div>
      </div>
    </div>
  );
}

function Report({ report, clientName, onRestart }: any) {
  const handleDownload = async () => {
    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report, clientName }),
      });
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `freedom-audit-${clientName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      a.click();
    } catch (err) {
      alert('Failed to generate PDF');
    }
  };

  return (
    <div className="fa-report">
      <div className="fa-report-inner">
        <div className="fa-report-header">
          <h1>Your Freedom Audit</h1>
          <p className="fa-report-subtitle">
            {clientName} · {new Date().toLocaleDateString()}
          </p>
        </div>

        {report.metatype && (
          <div className="fa-report-section">
            <h2>Your Metatype</h2>
            <Paragraphs text={report.metatype} />
          </div>
        )}

        {report.vision && report.reality && (
          <div className="fa-report-section">
            <h2>Your Alignment Score</h2>
            <GapVisual vision={report.vision} reality={report.reality} />
            {report.gap_narrative && <Paragraphs text={report.gap_narrative} />}
          </div>
        )}

        {report.strategy && (
          <div className="fa-report-section">
            <h2>Your Strategy</h2>
            <Paragraphs text={report.strategy} />
          </div>
        )}

        <div className="fa-report-actions">
          <button className="fa-btn" onClick={handleDownload}>
            Download PDF
          </button>
          <button className="fa-btn-secondary" onClick={onRestart}>
            Start New Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
