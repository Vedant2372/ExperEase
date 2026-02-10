import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { aiCare } from '../api/api';
import { Link } from 'react-router-dom';

export default function AiCare() {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setVoiceAvailable(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userInput = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: userInput }]);
    setLoading(true);
    
    try {
      const data = await aiCare(userInput, user?.user_id || 'default');
      const reply = data.question || data.message || 'No response.';
      
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: reply,
          stage: data.stage,
          severity: data.severity,
          doctors: data.suggested_doctors || [],
          firstAid: data.first_aid,
          medicines: data.otc_medicines,
          visitTiming: data.when_to_visit_doctor,
          specialist: data.specialist
        },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    if (!voiceAvailable) return;
    
    setIsListening(true);
    try {
      const transcript = "Voice input simulated";
      setInput(transcript);
    } catch (error) {
      console.error('Voice input failed:', error);
    } finally {
      setIsListening(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Care</h1>
              <p className="text-sm text-gray-600">Conversational Health Assistant</p>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to AI Care</h2>
              <p className="text-gray-600 mb-4">I'm your AI health assistant. Describe your symptoms and I'll help guide you.</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1h2a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z" />
                  </svg>
                  Follow-up questions
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048-.965C10.454 2.56 11.062 2 12 2s1.546.56 1.952 1.035L9.5 4.5m0 0l1.452 1.465C11.938 7.44 12.546 8 13 8s.562-.56.548-1.035L13.5 4.5m0 0L1.452 1.465C15.938 7.44 16.546 8 17 8s.562-.56.548-1.035L17.5 4.5m0 0L1.452 1.465C19.938 7.44 20.546 8 21 8s.562-.56.548-1.035L21.5 4.5m0 0L21 8m-9 3h12M3 20h18" />
                  </svg>
                  Voice support
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048-.965C10.454 2.56 11.062 2 12 2s1.546.56 1.952 1.035L9.5 4.5m0 0L1.452 1.465C11.938 7.44 12.546 8 13 8s.562-.56.548-1.035L13.5 4.5m0 0L1.452 1.465C15.938 7.44 16.546 8 17 8s.562-.56.548-1.035L17.5 4.5m0 0L1.452 1.465C19.938 7.44 20.546 8 21 8s.562-.56.548-1.035L21.5 4.5m0 0L21 8m-9 3h12M3 20h18" />
                  </svg>
                  Multilingual
                </div>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`max-w-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'} rounded-2xl px-4 py-3 shadow-md`}>
                {msg.role === 'assistant' && msg.stage === 'triage' && (
                  <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 mr-2 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01" />
                    </svg>
                    <span className="text-sm font-medium text-blue-600">Follow-up Question</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{msg.text}</p>
                
                {msg.role === 'assistant' && msg.stage === 'final' && (
                  <div className="mt-4 space-y-3 border-t pt-3">
                    {msg.severity && (
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 mr-2">Severity:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          msg.severity === 'severe' ? 'bg-red-100 text-red-700' :
                          msg.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {msg.severity}
                        </span>
                      </div>
                    )}
                    
                    {msg.specialist && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Specialist:</span>
                        <span className="text-blue-600 ml-2">{msg.specialist}</span>
                      </div>
                    )}
                    
                    {msg.firstAid && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">First Aid:</span>
                        <span className="text-gray-600 ml-2">{msg.firstAid}</span>
                      </div>
                    )}
                    
                    {msg.medicines && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Medicines:</span>
                        <span className="text-gray-600 ml-2">{JSON.stringify(msg.medicines)}</span>
                      </div>
                    )}
                    
                    {msg.visitTiming && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">When to visit:</span>
                        <span className="text-gray-600 ml-2">{msg.visitTiming}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white text-gray-900 rounded-2xl px-4 py-3 shadow-md">
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8C8 4.477 9.477 3 12 3s4 1.477 4 4v1a8 8 0 11-8 8v-1z"></path>
                  </svg>
                  <span className="text-sm">AI is analyzing...</span>
                </div>
              </div>
            )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your symptoms..."
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              {voiceAvailable && (
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  disabled={loading || isListening}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all disabled:opacity-50"
                >
                  {isListening ? (
                    <svg className="animate-pulse h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 017-7m-7 7v4m0 0H8m3 0h4" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 017-7m-7 7v4m0 0H8m3 0h4" />
                    </svg>
                  )}
                </button>
              )}
              
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8C8 4.477 9.477 3 12 3s4 1.477 4 4v1a8 8 0 11-8 8v-1z"></path>
                  </svg>
                ) : (
                  'Send'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
