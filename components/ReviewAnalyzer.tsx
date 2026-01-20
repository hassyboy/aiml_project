import React, { useState } from 'react';
import { analyzeSentiment, SentimentResult } from '../services/nlpService';
import { MessageSquare, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';

const ReviewAnalyzer: React.FC = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState<SentimentResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const data = await analyzeSentiment(text);
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 transition-all hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                    <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        AI Review Analyzer
                    </h3>
                    <p className="text-sm text-gray-500">Powered by BERT Transformer</p>
                </div>
            </div>

            <div className="space-y-4">
                <textarea
                    className="w-full p-4 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none text-gray-700"
                    rows={4}
                    placeholder="Type a visitor review here... (e.g., 'The architecture was stunning and well maintained!')"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <button
                    onClick={handleAnalyze}
                    disabled={loading || !text.trim()}
                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        'Analyze Sentiment'
                    )}
                </button>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm animate-fade-in">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="animate-fade-in">
                        <div className={`p-6 rounded-xl border ${result.sentiment === 'POSITIVE'
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                            }`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-lg font-bold flex items-center gap-2 ${result.sentiment === 'POSITIVE' ? 'text-green-700' : 'text-red-700'
                                    }`}>
                                    {result.sentiment === 'POSITIVE' ? (
                                        <><ThumbsUp className="w-5 h-5" /> Positive Experience</>
                                    ) : (
                                        <><ThumbsDown className="w-5 h-5" /> Negative Experience</>
                                    )}
                                </span>
                                <span className="text-sm font-medium text-gray-500">
                                    {(result.score * 100).toFixed(1)}% Confidence
                                </span>
                            </div>

                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ease-out ${result.sentiment === 'POSITIVE' ? 'bg-green-500' : 'bg-red-500'
                                        }`}
                                    style={{ width: `${result.score * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewAnalyzer;
