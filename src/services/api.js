import axios from 'axios';

// Resolve Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create configured Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Response Interceptor: Format error messages clearly
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'An unexpected error occurred while communicating with the server.';

    if (error.code === 'ECONNABORTED') {
      message = 'Request timed out. The Text-to-Speech synthesis server took too long to respond.';
    } else if (!error.response) {
      message = 'Network error: Unable to connect to backend server. Ensure backend is running on port 5000.';
    } else {
      const status = error.response.status;
      const serverMsg = error.response.data?.error || error.response.data?.message;

      switch (status) {
        case 400:
          message = serverMsg || 'Invalid request parameters. Please verify your text and voice selection.';
          break;
        case 401:
          message = 'Authentication failure: TTS API credentials are invalid or missing.';
          break;
        case 404:
          message = 'The requested TTS endpoint or voice model was not found.';
          break;
        case 429:
          message = 'Rate limit exceeded: You have sent too many speech synthesis requests. Please wait a moment.';
          break;
        case 500:
          message = serverMsg || 'Internal Server Error: The TTS synthesis service encountered an error.';
          break;
        case 503:
          message = 'TTS Service Unavailable: Upstream speech synthesis provider is currently unreachable.';
          break;
        default:
          message = serverMsg || `Server responded with status code ${status}.`;
      }
    }

    const enhancedError = new Error(message);
    enhancedError.statusCode = error.response?.status || 0;
    enhancedError.originalError = error;
    return Promise.reject(enhancedError);
  }
);

/**
 * Health Check API
 * GET /api/health
 */
export async function checkHealth() {
  try {
    return await apiClient.get('/health');
  } catch (err) {
    throw err;
  }
}

/**
 * Fetch Available Voices API
 * GET /api/voices
 */
export async function getVoices() {
  try {
    return await apiClient.get('/voices');
  } catch (err) {
    throw err;
  }
}

/**
 * Synthesize Speech API with Handshake & Fallback
 * POST /api/tts
 * @param {Object} payload { text, language, voice, speed, pitch }
 */
export async function synthesizeSpeech(payload) {
  try {
    // Attempt primary backend REST API communication
    const response = await apiClient.post('/tts', payload);
    return response;
  } catch (error) {
    // If backend is in standby / not running, trigger client-side Web Speech fallback (Page 6 of PDF)
    if (error.statusCode === 0 || error.message.includes('Network error')) {
      console.warn('[VoxFlow] Backend in standby. Activating Web Speech API fallback handshake...');
      return synthesizeWebSpeechFallback(payload);
    }
    throw error;
  }
}

/**
 * Client-Side Web Speech API Handshake Fallback (PDF Page 6: "Browser Web Speech API")
 */
function synthesizeWebSpeechFallback({ text, language, speed = 1.0, pitch = 0 }) {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      return reject(new Error('Browser Web Speech API is not supported in this browser.'));
    }

    window.speechSynthesis.cancel(); // Stop any pending utterances

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = Math.max(0.5, Math.min(2.0, speed));
    utterance.pitch = Math.max(0.5, Math.min(1.5, 1 + pitch / 100));

    // Try to match matching voice in browser
    const voices = window.speechSynthesis.getVoices();
    const matched = voices.find((v) => v.lang.startsWith(language.slice(0, 2)));
    if (matched) {
      utterance.voice = matched;
    }

    utterance.onstart = () => {
      console.log('[VoxFlow] Audio playback started via client handshake.');
    };

    const words = text.trim().split(/\s+/).length;
    const estimatedDuration = Math.max(1, Math.round(words / (2.5 * speed)));

    // Speak the utterance
    window.speechSynthesis.speak(utterance);

    // Resolve handshake payload matching backend schema
    resolve({
      success: true,
      audioUrl: 'web-speech-active',
      duration: estimatedDuration,
      characterCount: text.length,
      mode: 'web-speech-handshake'
    });
  });
}

export default apiClient;
