/**
 * API client for GimbalTax backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface ResearchedState {
  code: string;
  name: string;
  document_count: number;
  has_sales_tax: boolean;
}

export interface StatesResponse {
  total_documents: number;
  states_researched: number;
  states: ResearchedState[];
  states_not_researched: { code: string; name: string }[];
}

export interface ChatResponse {
  query: string;
  state_code: string | null;
  response: string;
  status: {
    llm_provider: string;
    vector_store_type: string;
    conversation_length: number;
  };
}

export interface StatusResponse {
  status: string;
  vector_store: {
    type: string;
    document_count: number;
  };
  agent: {
    llm_provider: string;
    vector_store_type: string;
    available_providers: string[];
    conversation_length: number;
  };
}

export async function getResearchedStates(): Promise<StatesResponse> {
  const response = await fetch(`${API_BASE_URL}/langchain/states/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch states: ${response.statusText}`);
  }
  return response.json();
}

export async function chatWithAgent(query: string, stateCode?: string): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/langchain/chat/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      state_code: stateCode || '',
    }),
  });
  if (!response.ok) {
    throw new Error(`Chat failed: ${response.statusText}`);
  }
  return response.json();
}

export async function getAgentStatus(): Promise<StatusResponse> {
  const response = await fetch(`${API_BASE_URL}/langchain/status/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch status: ${response.statusText}`);
  }
  return response.json();
}
