import React from 'react';

const ResponseDisplay = ({ chunks, answer }) => {
  if (!answer) return null;

  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb',
      padding: '32px',
      width: '100%',
      maxWidth: '896px',
      margin: '0 auto'
    },
    answerSection: {
      marginBottom: '24px'
    },
    answerHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px'
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      backgroundColor: '#f3e8ff',
      borderRadius: '50%',
      fontSize: '20px'
    },
    answerTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#111827',
      margin: 0
    },
    answerBox: {
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      padding: '24px',
      borderLeft: '4px solid #8b5cf6'
    },
    answerText: {
      color: '#1f2937',
      lineHeight: '1.6',
      whiteSpace: 'pre-wrap',
      margin: 0
    },
    passagesSection: {
      marginTop: '24px'
    },
    passagesHeader: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      margin: 0
    },
    passagesContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    passageItem: {
      backgroundColor: '#eff6ff',
      border: '1px solid #bfdbfe',
      borderRadius: '8px',
      padding: '16px',
      transition: 'background-color 0.2s',
      cursor: 'default'
    },
    passageContent: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    },
    passageNumber: {
      flexShrink: 0,
      width: '24px',
      height: '24px',
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '12px',
      fontWeight: 'bold',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '4px'
    },
    passageText: {
      color: '#374151',
      lineHeight: '1.6',
      flex: 1,
      margin: 0
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.answerSection}>
        <div style={styles.answerHeader}>
          <div style={styles.iconContainer}>
            📖
          </div>
          <h3 style={styles.answerTitle}>Answer</h3>
        </div>
        <div style={styles.answerBox}>
          <p style={styles.answerText}>{answer}</p>
        </div>
      </div>
      
      {chunks && chunks.length > 0 && (
        <div style={styles.passagesSection}>
          <h4 style={styles.passagesHeader}>
            📄 Relevant Passages ({chunks.length})
          </h4>
          <div style={styles.passagesContainer}>
            {chunks.map((chunk, index) => (
              <div 
                key={index} 
                style={styles.passageItem}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#dbeafe';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff';
                }}
              >
                <div style={styles.passageContent}>
                  <div style={styles.passageNumber}>
                    {index + 1}
                  </div>
                  <p style={styles.passageText}>{chunk}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseDisplay;