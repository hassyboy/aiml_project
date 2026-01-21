import React, { useState, useRef } from 'react';
import { Upload, AlertTriangle, Check, X, Camera, Loader2, Info } from 'lucide-react';

interface DamageResult {
    prediction: string;
    confidence: number;
    all_scores: Record<string, number>;
    error?: string;
}

const DamageAnalyzer: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [result, setResult] = useState<DamageResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Pointing to the Main Backend (which proxies to Microservice)
    const MICROSERVICE_URL = 'http://localhost:5000/predict';

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError("File is too large. Please select an image under 5MB.");
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;

        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            // Adding fetch timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 180000); // 3-minute timeout

            const response = await fetch(MICROSERVICE_URL, {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setResult(data);
        } catch (err: any) {
            console.error("Damage analysis failed:", err);
            if (err.name === 'AbortError') {
                setError("Connection timed out. The request took longer than 3 minutes.");
            } else if (err.message.includes('Failed to fetch')) {
                setError("Could not connect to the Server. Make sure 'app.py' and 'damage_service.py' are running!");
            } else {
                setError(err.message || "An unexpected error occurred.");
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    const resetSelection = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
                <h3 className="font-serif font-bold text-stone-800 flex items-center gap-2">
                    <Camera size={18} className="text-rose-900" />
                    Monument Doctor
                </h3>
                <span className="text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-medium">Beta</span>
            </div>

            <div className="p-5">
                {!selectedFile ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center cursor-pointer hover:bg-stone-50 hover:border-rose-300 transition-colors group"
                    >
                        <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-rose-50 text-stone-400 group-hover:text-rose-500 transition-colors">
                            <Upload size={24} />
                        </div>
                        <p className="text-sm font-medium text-stone-700">Upload a photo to analyze</p>
                        <p className="text-xs text-stone-500 mt-1">Supports JPG, PNG (Max 5MB)</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="relative rounded-lg overflow-hidden border border-stone-200 aspect-video bg-stone-100">
                            <img src={previewUrl!} alt="Preview" className="w-full h-full object-contain" />
                            <button
                                onClick={resetSelection}
                                className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {!result && !isAnalyzing && (
                            <button
                                onClick={handleAnalyze}
                                className="w-full py-2.5 bg-rose-900 text-white rounded-lg font-bold text-sm hover:bg-rose-800 transition-colors shadow-sm active:transform active:scale-[0.98]"
                            >
                                Analyze Condition
                            </button>
                        )}

                        {isAnalyzing && (
                            <div className="text-center py-4 text-stone-500 text-sm flex items-center justify-center gap-2">
                                <Loader2 size={16} className="animate-spin text-rose-600" />
                                Consulting the experts...
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg flex items-start gap-2 border border-red-100">
                                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                <p>{error}</p>
                            </div>
                        )}

                        {result && (
                            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Diagnosis</span>
                                    <span className="text-xs font-bold bg-white px-2 py-0.5 rounded shadow-sm text-emerald-700">
                                        {(result.confidence * 100).toFixed(1)}% Confident
                                    </span>
                                </div>

                                <h4 className="text-lg font-bold text-emerald-900 mb-1 flex items-center gap-2">
                                    <Check size={18} />
                                    {result.prediction.replace('_', ' ')}
                                </h4>

                                <p className="text-xs text-emerald-700 mt-2">
                                    {result.prediction === 'No_Damage'
                                        ? "This site appears to be in good condition."
                                        : "Signs of degradation detected. Preservation recommended."}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                />

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-start gap-2 text-[10px] text-stone-400">
                    <Info size={12} className="shrink-0 mt-0.5" />
                    <p>Powered by local Microservice on Port 5001. Requires separate Python server.</p>
                </div>
            </div>
        </div>
    );
};

export default DamageAnalyzer;
