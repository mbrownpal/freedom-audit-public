import './styles.css';

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
