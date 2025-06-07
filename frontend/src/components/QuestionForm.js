import React, { useState } from 'react';

const QuestionForm = ({ onResponse }) => {
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setIsAsking(true);
    try {
      const response = await fetch('http://localhost:8000/api/ask/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch answer');
      }
      
      const data = await response.json();
      onResponse(data);
      setQuestion("");
    } catch (err) {
      alert(err.message || "Failed to fetch answer.");
      console.error('Error details:', err);
    } finally {
      setIsAsking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

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
    header: {
      textAlign: 'center',
      marginBottom: '24px'
    },
    iconContainer: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '64px',
      height: '64px',
      backgroundColor: '#dcfce7',
      borderRadius: '50%',
      marginBottom: '16px',
      fontSize: '24px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '8px',
      margin: 0
    },
    subtitle: {
      color: '#6b7280',
      margin: 0
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    textareaContainer: {
      position: 'relative'
    },
    textarea: {
      width: '100%',
      padding: '16px',
      paddingRight: '48px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      resize: 'none',
      transition: 'all 0.2s',
      fontSize: '16px',
      fontFamily: 'inherit',
      boxSizing: 'border-box'
    },
    textareaFocused: {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },
    searchIcon: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      color: '#9ca3af',
      fontSize: '20px'
    },
    submitButton: {
      backgroundColor: isAsking ? '#9ca3af' : '#059669',
      color: 'white',
      fontWeight: '600',
      padding: '12px 32px',
      borderRadius: '8px',
      border: 'none',
      cursor: isAsking || !question.trim() ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontSize: '16px',
      alignSelf: 'flex-start'
    }
  };

  // Media query simulation for mobile
  const isMobile = window.innerWidth < 640;
  if (isMobile) {
    styles.submitButton.width = '100%';
    styles.submitButton.alignSelf = 'stretch';
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.iconContainer}>
          💬
        </div>
        <h2 style={styles.title}>Ask Questions</h2>
        <p style={styles.subtitle}>Ask anything about your uploaded PDF document</p>
      </div>

      <div style={styles.formContainer}>
        <div style={styles.textareaContainer}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What would you like to know about this document? (e.g., 'What are the main findings?', 'Summarize the methodology', 'What are the key conclusions?')"
            style={styles.textarea}
            rows="4"
            disabled={isAsking}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
          <div style={styles.searchIcon}>🔍</div>
        </div>
        
        <button
          onClick={handleAsk}
          disabled={!question.trim() || isAsking}
          style={styles.submitButton}
          onMouseOver={(e) => {
            if (!isAsking && question.trim()) {
              e.target.style.backgroundColor = '#047857';
            }
          }}
          onMouseOut={(e) => {
            if (!isAsking && question.trim()) {
              e.target.style.backgroundColor = '#059669';
            }
          }}
        >
          {isAsking ? (
            <>
              <span style={{animation: 'spin 1s linear infinite'}}>⏳</span>
              Analyzing...
            </>
          ) : (
            <>
              💬 Ask Question
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuestionForm;