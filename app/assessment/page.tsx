'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../styles.css';

export default function AssessmentPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read from sessionStorage
    const name = sessionStorage.getItem('userName');
    const email = sessionStorage.getItem('userEmail');
    
    if (!name || !email) {
      // If no session data, redirect to landing
      router.push('/');
      return;
    }
    
    setUserName(name);
    setUserEmail(email);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'var(--ink-2)'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="wrap" style={{ padding: '80px 32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ 
        fontFamily: 'var(--display)', 
        fontSize: 'clamp(40px, 6vw, 64px)', 
        color: 'var(--ink)',
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        Welcome, {userName}
      </h1>
      
      <p style={{ 
        fontFamily: 'var(--serif)', 
        fontSize: '21px', 
        lineHeight: '1.75', 
        color: 'var(--ink-2)',
        textAlign: 'center',
        marginBottom: '48px'
      }}>
        This is where the assessment questions will begin.
      </p>

      <div style={{
        background: 'var(--bg-elev)',
        border: '1px solid var(--rule)',
        borderRadius: '4px',
        padding: '32px',
        fontFamily: 'var(--mono)',
        fontSize: '13px',
        color: 'var(--ink-3)',
        lineHeight: '1.8'
      }}>
        <div style={{ color: 'var(--copper-2)', marginBottom: '16px', fontWeight: 500 }}>
          SESSION DATA:
        </div>
        <div>Name: {userName}</div>
        <div>Email: {userEmail}</div>
        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px dashed var(--rule-soft)' }}>
          <strong>NEXT STEP:</strong> Wire up the full question flow from the private repo.<br/>
          The landing page architecture is complete and swappable.
        </div>
      </div>

      <button
        onClick={() => router.push('/')}
        style={{
          marginTop: '48px',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          fontFamily: 'var(--mono)',
          fontSize: '11px',
          letterSpacing: '.28em',
          textTransform: 'uppercase',
          color: 'var(--copper-2)',
          background: 'transparent',
          border: '1px solid var(--copper)',
          padding: '14px 32px',
          cursor: 'pointer',
          borderRadius: '1px',
          transition: 'all .25s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(184,115,51,.1)';
          e.currentTarget.style.borderColor = 'var(--copper-2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'var(--copper)';
        }}
      >
        ← Back to Landing
      </button>
    </div>
  );
}
