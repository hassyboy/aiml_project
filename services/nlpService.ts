const API_URL = 'http://localhost:5000/analyze_sentiment';

export interface SentimentResult {
    sentiment: 'POSITIVE' | 'NEGATIVE';
    score: number;
}

export const analyzeSentiment = async (text: string): Promise<SentimentResult> => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        return await response.json();
    } catch (error: any) {
        console.error("Sentiment analysis failed:", error);
        throw new Error(error.message || "Failed to analyze sentiment");
    }
};
