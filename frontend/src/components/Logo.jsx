export default function Logo({ darkBackground = false }) {
  const textColor = darkBackground ? '#FFFFFF' : '#333e4f';
  const pinkColor = darkBackground ? '#FFFFFF' : '#E44D76';
  
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', fontFamily: "var(--font-heading), sans-serif" }}>
      <div style={{
        fontSize: '1.4rem',
        fontWeight: 600,
        color: textColor,
        display: 'inline-flex',
        alignItems: 'baseline',
        whiteSpace: 'nowrap',
        letterSpacing: '-0.5px',
        lineHeight: 1.1
      }}>
        <span>Silver Sm</span>
        <span style={{ color: pinkColor, position: 'relative', display: 'inline-block', fontSize: '1.25em' }}>
          ı
          <span style={{
            position: 'absolute',
            bottom: '100%', 
            left: '50%',
            transform: 'translate(-50%, 0.22em)', 
            width: '0.24em', 
            height: '0.24em',
            backgroundColor: pinkColor,
            borderRadius: '50%'
          }}></span>
        </span>
        <span style={{ position: 'relative', display: 'inline-block', width: '0.3em', margin: '0 0.05em 0 0.12em' }}>
          <svg 
            viewBox="0 0 20 40" 
            fill="none" 
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              left: 0,
              bottom: '-0.1em',
              width: '100%',
              height: '1.1em',
              overflow: 'visible'
            }}
          >
            <path d="M4 2 Q22 20 4 38" stroke={pinkColor} strokeWidth="8.5" strokeLinecap="round"/>
          </svg>
        </span>
        <span>e</span>
      </div>
    </div>
  );
}
