'use client';

import { useState, useEffect, useRef } from 'react';
import { getResearchedStates, chatWithAgent, type ResearchedState, type StatesResponse } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  stateCode?: string;
}

// Example queries per state
const STATE_EXAMPLES: Record<string, string[]> = {
  GA: ["What is Georgia's state sales tax rate?", "Are groceries taxable in Georgia?"],
  TX: ["What is Texas sales tax nexus threshold?", "Are digital products taxable in Texas?"],
  NV: ["What are Nevada's sales tax exemptions?", "Is manufacturing equipment exempt in Nevada?"],
  SD: ["Is SaaS taxable in South Dakota?", "What is South Dakota's economic nexus threshold?"],
  NY: ["What is the clothing exemption threshold in NY?", "How does NYC sales tax differ from upstate?"],
  CA: ["What are California district tax rates?", "How do I calculate use tax in California?"],
  NJ: ["Are groceries taxable in New Jersey?", "What is NJ's sales tax rate on clothing?"],
  IL: ["What are Illinois marketplace facilitator rules?", "Are services taxable in Illinois?"],
  ND: ["Are agricultural supplies exempt in North Dakota?", "What is ND's sales tax rate?"],
  VA: ["Are digital goods taxable in Virginia?", "What is Virginia's sales tax rate?"],
  PA: ["Is clothing exempt from PA sales tax?", "What is Pennsylvania's sales tax rate?"],
  NC: ["Are groceries taxable in North Carolina?", "What is NC's state sales tax rate?"],
  CO: ["How do home rule cities work in Colorado?", "What is Colorado's state sales tax rate?"],
  FL: ["When are Florida's tax-free holidays?", "Are groceries taxable in Florida?"],
  NE: ["Are services taxable in Nebraska?", "What is Nebraska's sales tax rate?"],
  MN: ["Is clothing taxable in Minnesota?", "What are MN's exemptions for manufacturing?"],
  AL: ["What is Alabama's combined state and local rate?", "Are groceries taxable in Alabama?"],
  CT: ["What is Connecticut's sales tax rate?", "Are luxury items taxed differently in CT?"],
  WY: ["What is Wyoming's sales tax rate?", "Are services taxable in Wyoming?"],
  AK: ["Does Alaska have state sales tax?", "Which Alaska cities have local sales tax?"],
  OR: ["Does Oregon have sales tax?", "Are there any transaction taxes in Oregon?"],
  MA: ["What is Massachusetts sales tax on meals?", "Are clothing items under $175 exempt?"],
};

export function SalesTaxChat() {
  const [states, setStates] = useState<StatesResponse | null>(null);
  const [selectedState, setSelectedState] = useState<string>('');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingStates, setIsLoadingStates] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load researched states on mount
  useEffect(() => {
    async function loadStates() {
      try {
        const data = await getResearchedStates();
        setStates(data);
        if (data.states.length > 0) {
          // Default to NY if available, otherwise first state
          const nyState = data.states.find(s => s.code === 'NY');
          setSelectedState(nyState ? 'NY' : data.states[0].code);
        }
      } catch (err) {
        setError('Failed to load researched states. Make sure the backend is running.');
        console.error(err);
      } finally {
        setIsLoadingStates(false);
      }
    }
    loadStates();
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: query,
      stateCode: selectedState,
    };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatWithAgent(query, selectedState);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
        stateCode: selectedState,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError('Failed to get response. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  const selectedStateInfo = states?.states.find(s => s.code === selectedState);
  const examples = STATE_EXAMPLES[selectedState] || [];

  if (isLoadingStates) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Loading researched states...</p>
      </div>
    );
  }

  if (!states || states.states.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <span className="text-4xl block mb-4">📭</span>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Research Data Available</h3>
        <p className="text-gray-600">
          {error || 'The knowledge base is empty. Run the research agent to populate it.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span>🤖</span> AI Sales Tax Assistant
        </h2>
        <p className="text-blue-100 text-sm mt-1">
          Ask questions about sales tax for any of our {states.states_researched} researched states
        </p>
      </div>

      {/* State Selector */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select a State ({states.total_documents.toLocaleString()} documents in knowledge base)
        </label>
        <div className="flex flex-wrap gap-2">
          {states.states.map((state) => (
            <button
              key={state.code}
              onClick={() => setSelectedState(state.code)}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                selectedState === state.code
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:bg-blue-50'
              )}
            >
              {state.code}
              <span className="ml-1 text-xs opacity-70">
                ({state.document_count.toLocaleString()})
              </span>
            </button>
          ))}
        </div>
        {selectedStateInfo && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: <strong>{selectedStateInfo.name}</strong> - {selectedStateInfo.document_count.toLocaleString()} documents
          </p>
        )}
      </div>

      {/* Example Queries */}
      {examples.length > 0 && (
        <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
          <p className="text-xs font-medium text-blue-700 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, idx) => (
              <button
                key={idx}
                onClick={() => handleExampleClick(example)}
                className="text-xs px-3 py-1 bg-white text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <span className="text-4xl block mb-2">💬</span>
            <p>Ask a question about {selectedStateInfo?.name || 'sales tax'} to get started!</p>
          </div>
        ) : (
          messages.map((message, idx) => (
            <div
              key={idx}
              className={cn(
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-4 py-2',
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="text-xs text-gray-500 mb-1">
                    {message.stateCode && `[${message.stateCode}] `}AI Response
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                <span className="text-sm">Researching {selectedStateInfo?.name}...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Ask about ${selectedStateInfo?.name || 'sales tax'}...`}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className={cn(
              'px-6 py-2 rounded-lg font-medium transition-colors',
              isLoading || !query.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            {isLoading ? '...' : 'Ask'}
          </button>
        </div>
      </form>

      {/* Stats Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>
            {states.states_researched} states researched | {states.states_not_researched.length} pending
          </span>
          <span>
            Powered by RAG + {states.total_documents.toLocaleString()} indexed documents
          </span>
        </div>
      </div>
    </div>
  );
}
