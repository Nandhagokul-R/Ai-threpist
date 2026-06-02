import React, { useState, useEffect, useCallback } from 'react';
import type { Chat } from '@google/genai';
import Header from './components/Header';
import HistorySidebar from './components/HistorySidebar';
import ChatWindow from './components/ChatWindow';
import EmotionalAnalysisView from './components/EmotionalAnalysisView';
import { startChat, sendMessage, analyzeChatHistory } from './services/geminiService';
import type { ChatSession, ChatMessage, MessageSentiment, MoodState, Recommendation, AnalysisResult } from './types';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'chat' | 'analysis'>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lastModelSentiment, setLastModelSentiment] = useState<MessageSentiment>('Neutral');
  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  // Analysis-related state
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Load sessions from localStorage on initial render and select first chat
  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem('chatSessions');
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions);
        if (Array.isArray(parsedSessions)) {
          setSessions(parsedSessions);
          if (parsedSessions.length > 0 && !activeSessionId) {
            setActiveSessionId(parsedSessions[0].id);
          }
        }
      }
    } catch (e) {
      console.error("Failed to load sessions from local storage:", e);
      setSessions([]);
    }
    // We only want this to run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('chatSessions', JSON.stringify(sessions));
    } catch (e) {
      console.error("Failed to save sessions to local storage:", e);
    }
  }, [sessions]);

  // This effect handles the consequence of a session being deleted.
  // If the active ID is no longer valid, it selects a new one.
  useEffect(() => {
    if (activeSessionId && !sessions.find(s => s.id === activeSessionId)) {
      setActiveSessionId(sessions.length > 0 ? sessions[0].id : null);
    }
  }, [sessions, activeSessionId]);

  // This effect creates/updates the Gemini Chat instance when the active session changes.
  useEffect(() => {
    if (!activeSessionId) {
      setActiveChat(null);
      return;
    }
    const session = sessions.find(s => s.id === activeSessionId);
    if (session) {
      setActiveChat(startChat(session.messages));
    }
  }, [activeSessionId, sessions]);

  // This effect updates the last known sentiment when the active chat changes
  useEffect(() => {
    const activeSession = sessions.find(s => s.id === activeSessionId);
    if (activeSession?.messages.length) {
      const lastModelMsg = [...activeSession.messages].reverse().find(m => m.role === 'model');
      setLastModelSentiment(lastModelMsg?.sentiment || 'Neutral');
    } else {
      setLastModelSentiment('Neutral');
    }
  }, [activeSessionId, sessions]);

  const selectChat = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
    setCurrentView('chat');
    setIsSidebarOpen(false);
  }, []);

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'New Conversation',
      messages: [],
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setCurrentView('chat');
    setIsSidebarOpen(false);
  };

  const deleteChat = (sessionId: string) => {
    if (window.confirm("Are you sure you want to delete this conversation?")) {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    }
  };

  const renameChat = (sessionId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setSessions(prev =>
      prev.map(s =>
        s.id === sessionId ? { ...s, title: newTitle.trim() } : s
      )
    );
  };

  const performAnalysis = useCallback(async () => {
    const sessionToAnalyze = sessions.find(s => s.id === activeSessionId);

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    if (!sessionToAnalyze || sessionToAnalyze.messages.length <= 1) {
      setAnalysisError("There aren't enough messages to create an analysis yet. Continue your conversation with Aura, then check back here to see your emotional progress.");
      setIsAnalyzing(false);
      return;
    }

    try {
      const result = await analyzeChatHistory(sessionToAnalyze.messages);
      setAnalysisResult(result);
    } catch (e: any) {
      let errorMessage = 'An unknown error occurred during analysis.';
      if (e?.error?.message) {
        errorMessage = e.error.message;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      }
      setAnalysisError(`Failed to analyze conversation: ${errorMessage}`);
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  }, [activeSessionId, sessions]);

  const handleAnalyze = useCallback(async () => {
    if (activeSessionId) {
      setCurrentView('analysis');
      setIsSidebarOpen(false);
      await performAnalysis();
    }
  }, [activeSessionId, performAnalysis]);

  const handleBackToChat = () => {
    setCurrentView('chat');
  };

  const handleSendMessage = useCallback(async (input: string) => {
    if (!input.trim()) return;

    let currentSessionId = activeSessionId;
    let chatToUse = activeChat;

    // 1. Handle creation of a new session if needed
    if (!currentSessionId) {
      const newSessionId = `session-${Date.now()}`;
      const newTitle = input.split(' ').slice(0, 5).join(' ') + (input.split(' ').length > 5 ? '...' : '');
      const newSession: ChatSession = {
        id: newSessionId,
        title: newTitle,
        messages: [], // Will add user message in step 2
      };

      // Create a chat instance for this call, and also update state for subsequent calls
      chatToUse = startChat([]);
      setActiveChat(chatToUse);
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSessionId);
      currentSessionId = newSessionId;
    }

    if (!chatToUse || !currentSessionId) {
      setError("Error: Could not initialize chat.");
      return;
    }

    // 2. Add user message to state
    const userMessage: ChatMessage = { role: 'user', content: input };
    setSessions(prev =>
      prev.map(s => {
        if (s.id === currentSessionId) {
          // Also handle renaming if it's the first message in an existing "New Conversation" chat
          const title = s.title === 'New Conversation'
            ? input.split(' ').slice(0, 5).join(' ') + (input.split(' ').length > 5 ? '...' : '')
            : s.title;
          return { ...s, title, messages: [...s.messages, userMessage] };
        }
        return s;
      })
    );

    setIsLoading(true);
    setError(null);

    // 3. Add model response placeholder to state BEFORE the API call
    setSessions(prev =>
      prev.map(s =>
        s.id === currentSessionId
          ? { ...s, messages: [...s.messages, { role: 'model', content: '' }] }
          : s
      )
    );

    try {
      // 4. Make the API call
      const responseStream = await sendMessage(chatToUse, input);

      // 5. Stream the response
      let fullResponse = '';
      for await (const chunk of responseStream) {
        fullResponse += chunk.text;
        setSessions(prev =>
          prev.map(s => {
            if (s.id === currentSessionId) {
              const newMessages = [...s.messages];
              newMessages[newMessages.length - 1] = { role: 'model', content: fullResponse };
              return { ...s, messages: newMessages };
            }
            return s;
          })
        );
      }

      // 6. Finalize the response with sentiment, mood, and recommendations
      let content = fullResponse;
      let sentiment: MessageSentiment = 'Neutral';
      let mood: MoodState = 'Neutral';
      let recommendation: Recommendation | undefined = undefined;

      // Extract Recommendation
      const recMatch = content.match(/\[REC:\s*(\w+):\s*([^:]+):\s*([^\]]+)\]/);
      if (recMatch) {
        recommendation = {
          type: recMatch[1].trim() as 'game' | 'music',
          title: recMatch[2].trim(),
          url: recMatch[3].trim(),
        };
        content = content.replace(recMatch[0], '').trim();
      }

      // Extract Mood
      const moodMatch = content.match(/\[MOOD:\s*(\w+)\]/);
      if (moodMatch) {
        mood = moodMatch[1].trim() as MoodState;
        content = content.replace(moodMatch[0], '').trim();
      }

      // Extract Sentiment
      const sentimentMatch = content.match(/\[(Supportive|Empathetic|Neutral)\]/);
      if (sentimentMatch) {
        sentiment = sentimentMatch[1] as MessageSentiment;
        content = content.replace(sentimentMatch[0], '').trim();
      }

      setLastModelSentiment(sentiment);
      setSessions(prev =>
        prev.map(s => {
          if (s.id === currentSessionId) {
            const newMessages = [...s.messages];
            newMessages[newMessages.length - 1] = {
              role: 'model',
              content,
              sentiment,
              mood,
              recommendation
            };
            return { ...s, messages: newMessages };
          }
          return s;
        })
      );
    } catch (e: any) {
      // 7. Handle errors
      let errorMessage = 'An unknown error occurred.';
      if (e?.error?.message) { errorMessage = e.error.message; }
      else if (e instanceof Error) { errorMessage = e.message; }
      setError(`Error: ${errorMessage}`);
      setSessions(prev =>
        prev.map(s => {
          if (s.id === currentSessionId) {
            const newMessages = [...s.messages];
            newMessages[newMessages.length - 1] = { role: 'model', content: `Sorry, I encountered an error: ${errorMessage}` };
            return { ...s, messages: newMessages };
          }
          return s;
        })
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeSessionId, sessions, activeChat]);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  return (
    <div className="flex h-screen w-screen bg-[#0a0e1a] text-gray-200 font-sans">
      <HistorySidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewChat={createNewChat}
        onSelectChat={selectChat}
        onDeleteChat={deleteChat}
        onRenameChat={renameChat}
        onAnalyze={handleAnalyze}
        currentView={currentView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <Header onMenuClick={() => setIsSidebarOpen(prev => !prev)} />
        {currentView === 'chat' ? (
          <ChatWindow
            messages={activeSession?.messages || []}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onAnalyze={handleAnalyze}
            lastModelSentiment={lastModelSentiment}
            sessionId={activeSessionId}
          />
        ) : (
          <EmotionalAnalysisView
            onBack={handleBackToChat}
            analysis={analysisResult}
            isLoading={isAnalyzing}
            error={analysisError}
            onRegenerate={performAnalysis}
          />
        )}
      </div>
    </div>
  );
};

export default App;