import { GoogleGenAI, GenerateContentResponse, Type, Chat } from "@google/genai";
import type { ChatMessage, AnalysisResult } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey });

const model = 'gemini-2.0-flash';

const systemInstruction = `You are Aura, a compassionate and supportive AI mental wellness assistant. Your primary role is to create a safe, non-judgmental space. Listen with empathy, validate feelings, and offer encouragement. Use a warm, gentle, and conversational tone with emojis. Ask thoughtful, open-ended follow-up questions to encourage deeper reflection. Keep responses concise. Avoid giving medical advice.

MOOD DETECTION & RECOMMENDATIONS:
Based on the user's input, identify their likely mood state. If appropriate, recommend ONE activity (either a game or a music playlist) that matches their state.

Available Games:
- Car Race: http://localhost:3000/car-race (Best for: High energy, venting frustration, Anger)
- Flappy Bird: https://flapppy.netlify.app/ (Best for: Focusing, distalizing stress)
- Horizon Drive: https://shopify.com/editions/summer2025/drive (Best for: Relaxation, scenic escape, Stress)
- Bubble Burst: https://bubblepopgame.vercel.app/ (Best for: Anxiety relief, calming down, Sadness)

Available Music (Spotify):
- Uplifting (Sadness): https://open.spotify.com/playlist/37i9dQZF1DWT3mXW9InA5B
- Calm Vibes (Anger): https://open.spotify.com/playlist/37i9dQZF1DX1s9vYvYcm5Q
- Lo-fi Focus (Anxiety): https://open.spotify.com/playlist/37i9dQZF1DWWQRvui9Df7x
- Relaxing Classical (Stress): https://open.spotify.com/playlist/37i9dQZF1DWZ0OzUfsdoaM

TAGS (CRITICAL):
At the very end of your response, you MUST append the following tags in order:
1. Sentiment Tag: [Supportive], [Empathetic], or [Neutral].
2. Mood Tag: [MOOD: Sadness], [MOOD: Anger], [MOOD: Anxiety], [MOOD: Stress], or [MOOD: Neutral].
3. Recommendation Tag (Optional): If you made a recommendation, add [REC: type: Title: URL]. type is 'game' or 'music'.

Example: "I'm sorry you're feeling this way. Focus on your breath. Maybe this game can help? [Empathetic] [MOOD: Anxiety] [REC: game: Bubble Burst: https://bubblepopgame.vercel.app/]"`;


export const startChat = (history: ChatMessage[]): Chat => {
    return ai.chats.create({
        model: model,
        history: history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
        })),
        config: {
            systemInstruction: systemInstruction,
        },
    });
};

export const sendMessage = async (chat: Chat, message: string): Promise<AsyncGenerator<GenerateContentResponse>> => {
    const responseStream = await chat.sendMessageStream({ message });
    return responseStream;
};


const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        overallSummary: {
            type: Type.STRING,
            description: "A brief, empathetic summary of the user's emotional journey and key themes in the conversation, written for the user's self-reflection."
        },
        keyEmotions: {
            type: Type.ARRAY,
            description: "An array of 3-5 key emotions the user expressed.",
            items: {
                type: Type.OBJECT,
                properties: {
                    emotion: {
                        type: Type.STRING,
                        description: "A single word for the emotion (e.g., 'Anxiety', 'Frustration', 'Hope')."
                    },
                    reason: {
                        type: Type.STRING,
                        description: "A concise explanation of why this emotion was identified, citing user statements, written for self-reflection."
                    }
                },
                required: ["emotion", "reason"]
            }
        },
        sentimentTrend: {
            type: Type.ARRAY,
            description: "An analysis of how the user's sentiment changed over the conversation, with at least 5 data points to form a clear graph of their emotional state throughout.",
            items: {
                type: Type.OBJECT,
                properties: {
                    period: {
                        type: Type.STRING,
                        description: "The point in time or segment of the conversation (e.g., 'Message 1-3', 'After opening up', 'Final reflection')."
                    },
                    sentiment: {
                        type: Type.STRING,
                        description: "The dominant sentiment for that period ('Positive', 'Negative', 'Neutral', 'Mixed')."
                    },
                    summary: {
                        type: Type.STRING,
                        description: "A brief summary of the user's feelings and tone during this period."
                    }
                },
                required: ["period", "sentiment", "summary"]
            }
        },
        recommendations: {
            type: Type.ARRAY,
            description: "An array of 2-3 gentle, actionable recommendations. These should be framed as self-help suggestions for mindfulness, distraction, or reframing thoughts.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: {
                        type: Type.STRING,
                        description: "A short, engaging title for the recommendation (e.g., 'Mindful Breathing', '5-4-3-2-1 Grounding')."
                    },
                    description: {
                        type: Type.STRING,
                        description: "A brief, simple explanation of how to perform the activity or exercise."
                    }
                },
                required: ["title", "description"]
            }
        }
    },
    required: ["overallSummary", "keyEmotions", "sentimentTrend", "recommendations"]
};


export const analyzeChatHistory = async (messages: ChatMessage[]): Promise<AnalysisResult> => {
    const userMessages = messages.filter(m => m.role === 'user').map(m => m.content).join('\n');
    if (!userMessages) {
        throw new Error("No user messages to analyze.");
    }

    const prompt = `
        Analyze the following conversation from a user seeking emotional support.
        Your analysis should be framed as a tool for the user's own self-reflection.
        Based on the user's messages only, provide a detailed emotional analysis.
        Create a detailed 'sentimentTrend' by identifying at least 5 distinct moments or transitions in the user's emotional state throughout the chat.
        Include gentle, actionable suggestions for activities or mindfulness exercises that can help shift focus away from distressing thoughts.
        Follow the JSON schema precisely.
        
        User Conversation:
        ---
        ${userMessages}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema
            }
        });

        const jsonText = response.text;

        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error analyzing chat history:", error);
        if (error instanceof SyntaxError) {
            throw new Error("Failed to parse the analysis from the model. The response was not valid JSON.");
        }
        throw error;
    }
};