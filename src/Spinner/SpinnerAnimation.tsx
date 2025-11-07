
const HandLoadingSpinner = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'transparent'
    }}>
      <div style={{
        position: 'relative',
        width: '100px',
        height: '100px',
        marginBottom: '32px'
      }}>
        {[...Array(8)].map((_, index) => {
          const rotation = (index * 360) / 8;
          const delay = index * 0.1;
          
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                transform: `rotate(${rotation}deg)`
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: `rgba(239, 68, 68, ${1 - index * 0.1})`,
                  animation: `pulse 1.2s ease-in-out infinite`,
                  animationDelay: `${delay}s`
                }}
              />
            </div>
          );
        })}
        
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            animation: 'spin 1.2s linear infinite'
          }}
        />
      </div>
      
      <div style={{
        display: 'flex',
        gap: '4px',
        fontSize: '2rem',
        fontWeight: '900',
        letterSpacing: '0.05em',
        color: '#374151'
      }}>
        {'CARGANDO'.split('').map((letter, index) => (
          <span
            key={index}
            style={{
              display: 'inline-block',
              animation: 'bounce 1s ease-in-out infinite',
              animationDelay: `${index * 0.08}s`
            }}
          >
            {letter}
          </span>
        ))}
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.3);
            opacity: 0.7;
          }
        }
        
        @keyframes bounce {
          0%, 100% { 
            transform: translateY(0) scale(1); 
          }
          50% { 
            transform: translateY(-15px) scale(1.05); 
          }
        }
      `}</style>
    </div>
  );
};

export default HandLoadingSpinner;