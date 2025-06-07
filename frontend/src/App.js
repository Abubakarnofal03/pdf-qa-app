import React, { useState } from 'react';
import PDFUpload from './components/PDFUpload';
import QuestionForm from './components/QuestionForm';
import ResponseDisplay from './components/ResponseDisplay';

function App() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [responseData, setResponseData] = useState(null);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>PDF Q&A (FAISS + Gemini)</h2>
      <PDFUpload onUploadSuccess={() => setIsUploaded(true)} />

      {isUploaded && (
        <>
          <hr />
          <QuestionForm onResponse={setResponseData} />
        </>
      )}

      {responseData && (
        <>
          <hr />
          <ResponseDisplay chunks={responseData.faiss_chunks} answer={responseData.answer} />
        </>
      )}
    </div>
  );
}

export default App;
