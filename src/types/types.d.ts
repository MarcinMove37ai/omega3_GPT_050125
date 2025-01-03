declare module '@anthropic-ai/sdk';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface Source {
  PMID: string;
  title: string;
  domain_primary: string;
  domain_secondary?: string;
  __nn_distance: number;
  url: string;
}

interface ChatResponse {
  response: string;
  sources: Source[];
}