import './styles.css';
import Script from 'next/script';

export const metadata = {
  title: 'The Freedom Audit',
  description: 'A diagnostic for the already successful',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '805390589299003');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=805390589299003&ev=PageView&noscript=1"
          />
        </noscript>
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `
            const els = document.querySelectorAll('.fade');
            const io = new IntersectionObserver((entries)=>{
              entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
            },{rootMargin:'-5% 0px -8% 0px', threshold:0.05});
            els.forEach(el=>io.observe(el));
            requestAnimationFrame(()=>{
              document.querySelectorAll('.hero .fade').forEach((el,i)=>{
                setTimeout(()=>el.classList.add('in'), 120 + i*140);
              });
            });
          `
        }} />
      </body>
    </html>
  );
}
