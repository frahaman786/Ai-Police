import React, { useState, useEffect } from 'react';

// Main App Component
function App() {
   const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar setCurrentPage={setCurrentPage} />
      {/* Changed main to w-100 and removed container-fluid */}
      <main className="flex-grow-1 py-4 py-md-5 w-100">
        {/* Corrected conditional rendering structure */}
        {currentPage === 'home' ? (
          <HomePage setCurrentPage={setCurrentPage} />
        ) : (
          <DetectorPage />
        )}
      </main>
      <Footer />
    </div>
  );
}

// Navbar Component
function Navbar({ setCurrentPage }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm rounded-bottom">
      <div className="container-fluid"> {/* Navbar content remains fluid */}
        <button className="navbar-brand d-flex align-items-center" onClick={() => setCurrentPage('home')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ height: '2rem', width: '2rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L20 20m-6-6l2-2m2-2l2-2" />
          </svg>
          <span className="fw-bold text-dark fs-4">AI Image Detector</span>
        </button>
        {/* Dark Mode Featuers */}
        


        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <button
                onClick={() => setCurrentPage('home')}
                className="btn btn-link nav-link text-secondary fw-semibold fs-5"
              >
                Home
              </button>
            </li>
            <li className="nav-item">
              <button
                onClick={() => setCurrentPage('detector')}
                className="btn btn-link nav-link text-secondary fw-semibold fs-5"
              >
                Detector
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-auto rounded-top">
      <div className="container-fluid text-center text-sm"> {/* Footer content remains fluid */}
        <p className="mb-1">&copy; {new Date().getFullYear()} AI Image Detector. All rights reserved.</p>
        <p className="mb-0">Built By Fazley.</p>
      </div>
    </footer>
  );
}

// Home Page Component
function HomePage({ setCurrentPage }) {
  return (
    <section className="text-center py-5 py-md-5 py-lg-5">
      {/* The section itself will now take full width from main */}
      <h1 className="display-3 fw-bolder text-primary mb-4 animate__animated animate__fadeInDown">
        Uncover the Truth Behind Images
      </h1>
      {/* Re-added mx-auto and maxWidth for the paragraph for readability */}
      <p className="lead text-secondary mx-auto mb-5" style={{ maxWidth: '700px' }}>
        Our advanced AI helps you detect subtle patterns and characteristics to determine if an image is AI-generated or real.
      </p>

      {/* Re-added mx-auto and maxWidth to the card to center it */}
      <div className="card shadow-lg p-4 p-md-5 mx-auto animate__animated animate__zoomIn" style={{ maxWidth: '900px', borderRadius: '1rem' }}>
        <h2 className="card-title h3 fw-bold text-dark mb-4">How to Use:</h2>
        <ol className="list-group list-group-numbered text-start text-secondary fs-5 mb-5">
          <li className="list-group-item border-0 ps-0">
            <strong className="text-primary">Click "Get Started" or "Detector"</strong>: Navigate to the image detection page.
          </li>
          <li className="list-group-item border-0 ps-0">
            <strong className="text-primary">Upload Your Image</strong>: Select an image file (JPG, PNG) from your device.
          </li>
          <li className="list-group-item border-0 ps-0">
            <strong className="text-primary">Analyze</strong>: Our AI will process the image to provide insights.
          </li>
          <li className="list-group-item border-0 ps-0">
            <strong className="text-primary">View Results</strong>: Get a detailed description and potential indicators.
          </li>
        </ol>
        <button
          onClick={() => setCurrentPage('detector')}
          className="btn btn-primary btn-lg rounded-pill shadow-lg animate__animated animate__bounceIn"
          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', fontSize: '1.25rem' }}
        >
          Get Started
        </button>
      </div>
    </section>
  );
}

// Detector Page Component
function DetectorPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
        setDetectionResult(null); // Clear previous result
        setError(null); // Clear previous error
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreviewUrl(null);
      setDetectionResult(null);
      setError(null);
    }
  };

  // Convert image to base64 for API
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // Get base64 string after 'data:image/jpeg;base64,'
      reader.onerror = (error) => reject(error);
    });
  };

  // Simulate API call to Gemini for image understanding
  const analyzeImage = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setDetectionResult(null);

    try {
      const base64ImageData = await getBase64(selectedFile);
      // MODIFIED PROMPT: Asking for a more concise description
      const prompt = "Briefly describe this image, focusing on its main content and style. Conclude with a very concise observation if it appears to be a real photograph or an AI-generated image, based on common characteristics, in no more than three sentences.";

      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: selectedFile.type,
                  data: base64ImageData,
                },
              },
            ],
          },
        ],
      };

      // The API key will be automatically provided by the Canvas environment
      const apiKey = process.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${response.status} - ${errorData.error.message || 'Unknown error'}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setDetectionResult(text);
      } else {
        setError("No detection result found. The API response was empty or malformed.");
      }

    } catch (err) {
      console.error("Error analyzing image:", err);
      setError(`Failed to analyze image: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-4 py-md-5">
      {/* Re-added mx-auto and maxWidth to the card to center it */}
      <div className="card shadow-lg p-4 p-md-5 mx-auto animate__animated animate__zoomIn" style={{ maxWidth: '900px', borderRadius: '1rem' }}>
        <h2 className="card-title h3 fw-bold text-primary mb-4 text-center">Image Detector</h2>

        <div className="row g-4">
          {/* Image Upload Section */}
          <div className="col-md-6 d-flex flex-column align-items-center p-4 border border-dashed rounded-3 bg-light-subtle">
            <label htmlFor="image-upload" className="w-100 text-center py-4 cursor-pointer">
              <input
                id="image-upload"
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
                className="d-none"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-info mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" style={{ height: '4rem', width: '4rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="fs-5 text-dark fw-semibold">Drag & Drop or <span className="text-primary fw-bold">Browse Image</span></p>
              <p className="text-muted small mt-1">Supports JPG, PNG (Max 5MB)</p>
            </label>

            {imagePreviewUrl && (
              <div className="mt-4 w-75 rounded-3 overflow-hidden shadow-sm border border-light">
                <img src={imagePreviewUrl} alt="Preview" className="img-fluid" />
              </div>
            )}

            <button
              onClick={analyzeImage}
              disabled={!selectedFile || loading}
              className={`btn btn-primary btn-lg rounded-pill shadow-sm mt-4 ${(!selectedFile || loading) ? 'disabled' : ''}`}
              style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
            >
              {loading ? (
                <span className="d-flex align-items-center justify-content-center">
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Analyzing...
                </span>
              ) : (
                'Analyze Image'
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="col-md-6 p-4 bg-light-subtle rounded-3 shadow-inner border border-light">
            <h3 className="h4 fw-bold text-dark mb-4">Detection Result:</h3>
            {error && (
              <div className="alert alert-danger" role="alert">
                <strong className="fw-bold">Error!</strong> {error}
              </div>
            )}
            {detectionResult ? (
              <div className="card card-body shadow-sm border border-light">
                <p className="text-secondary mb-0" style={{ whiteSpace: 'pre-wrap' }}>{detectionResult}</p>
              </div>
            ) : (
              <div className="text-center text-muted py-5">
                {loading ? (
                  <p>Awaiting analysis...</p>
                ) : (
                  <p>Upload an image and click "Analyze" to see the results.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
