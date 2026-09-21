import axios from 'axios';

// Resolve Backend API base URL & root host for static audio
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const BACKEND_ROOT = API_BASE_URL.replace(/\/api\/?$/, '');

/**
 * Resolve audio URL to absolute production domain if relative
 */
export function resolveAudioUrl(url) {
  if (!url || url === 'web-speech-active') return url;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url;
  }
  return `${BACKEND_ROOT}${url.startsWith('/') ? '' : '/'}${url}`;
}

// Create configured Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Request Interceptor: Automatically attach Auth Token if logged in
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('voxflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
          message = serverMsg || 'Authentication required. Please sign in.';
          break;
        case 404:
          message = 'The requested endpoint or audio resource was not found.';
          break;
        case 429:
          message = 'Rate limit exceeded: You have sent too many requests. Please wait a moment.';
          break;
        case 500:
          message = serverMsg || 'Internal Server Error: Synthesis service encountered an issue.';
          break;
        case 503:
          message = 'TTS Service Unavailable: Upstream speech provider is currently unreachable.';
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
  return await apiClient.get('/health');
}

/**
 * Fetch Available Voices API
 * GET /api/voices
 */
export async function getVoices() {
  return await apiClient.get('/voices');
}

/**
 * Synthesize Speech API with Handshake & Fallback
 * POST /api/tts
 */
export async function synthesizeSpeech(payload) {
  try {
    const response = await apiClient.post('/tts', payload);
    if (response?.audioUrl && response.audioUrl !== 'web-speech-active') {
      response.audioUrl = resolveAudioUrl(response.audioUrl);
    }
    return response;
  } catch (error) {
    if (error.statusCode === 0 || error.message.includes('Network error')) {
      console.warn('[VoxFlow] Backend in standby. Activating Web Speech API fallback...');
      return synthesizeWebSpeechFallback(payload);
    }
    throw error;
  }
}

/**
 * Authentication APIs
 */
export async function loginUser(email, password) {
  return await apiClient.post('/auth/login', { email, password });
}

export async function registerUser(name, email, password) {
  return await apiClient.post('/auth/register', { name, email, password });
}

export async function getMe() {
  return await apiClient.get('/auth/me');
}

export async function updateUserPassword(currentPassword, newPassword) {
  return await apiClient.put('/auth/update-password', { currentPassword, newPassword });
}

/**
 * User Personalized History APIs
 */
export async function fetchUserHistory() {
  const history = await apiClient.get('/user/history');
  if (Array.isArray(history)) {
    return history.map((item) => ({
      ...item,
      audioUrl: resolveAudioUrl(item.audioUrl)
    }));
  }
  return history;
}

export async function toggleFavoriteApi(historyId) {
  return await apiClient.patch(`/user/history/${historyId}/favorite`);
}

export async function deleteHistoryApi(historyId) {
  return await apiClient.delete(`/user/history/${historyId}`);
}

/**
 * Client-Side Web Speech API Handshake Fallback
 */
function synthesizeWebSpeechFallback({ text, language, voice = '', speed = 1.0, pitch = 0 }) {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      return reject(new Error('Browser Web Speech API is not supported in this browser.'));
    }

    window.speechSynthesis.cancel();

    const isMale = /guy|madhur|niranjan|manohar|alvaro|henri|conrad|ryan|male/i.test(voice);
    const isAria = /aria/i.test(voice);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = Math.max(0.5, Math.min(2.0, speed));

    const personaPitch = isMale ? 0.78 : isAria ? 1.22 : 1.05;
    utterance.pitch = Math.max(0.4, Math.min(1.8, personaPitch * (1 + pitch / 100)));

    const voices = window.speechSynthesis.getVoices();
    const langVoices = voices.filter((v) => 
      v.lang.toLowerCase().replace('_', '-').startsWith(language.slice(0, 2).toLowerCase())
    );

    let matchedVoice = langVoices.find((v) => {
      const name = v.name.toLowerCase();
      if (isMale) return /david|mark|george|male|guy|ravi|hemant|pablo|stefan|claude/i.test(name);
      if (isAria) return /aria|zira|expressive/i.test(name);
      return /zira|susan|hazel|female|jenny|swara|kalpana|elena|denise|katja/i.test(name);
    });

    if (!matchedVoice && langVoices.length > 0) {
      matchedVoice = isMale ? langVoices[langVoices.length - 1] : langVoices[0];
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    const words = text.trim().split(/\s+/).length;
    const estimatedDuration = Math.max(1, Math.round(words / (2.5 * speed)));

    window.speechSynthesis.speak(utterance);

    resolve({
      success: true,
      audioUrl: 'web-speech-active',
      duration: estimatedDuration,
      characterCount: text.length,
      voice,
      mode: 'web-speech-handshake'
    });
  });
}

export default apiClient;
