import axios from 'axios';

// Resolve Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create configured Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30s timeout for synthesis jobs
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Request Interceptor: Log / Pre-process
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format error messages clearly
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'An unexpected error occurred while communicating with the server.';

    if (error.code === 'ECONNABORTED') {
      message = 'Request timed out. The Text-to-Speech synthesis server took too long to respond.';
    } else if (!error.response) {
      message = 'Network error: Unable to connect to the backend server. Please verify the server is running.';
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
 * Synthesize Speech API
 * POST /api/tts
 * @param {Object} payload { text, language, voice, speed, pitch }
 */
export async function synthesizeSpeech(payload) {
  try {
    return await apiClient.post('/tts', payload);
  } catch (err) {
    throw err;
  }
}

export default apiClient;
