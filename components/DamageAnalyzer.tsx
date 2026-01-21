import React, { useState, useRef } from 'react';
import { Upload, AlertTriangle, Check, X, Camera, Loader2, Info, Save, FileText, MapPin, History } from 'lucide-react';
import DamageDashboard from './DamageDashboard.tsx';

interface DamageResult {
    prediction: string;
    confidence: number;
    all_scores: Record<string, number>;
    error?: string;
}

const KARNATAKA_DISTRICTS = [
    "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar",
    "Chikkaballapura", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davangere", "Dharwad", "Gadag",
    "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur",
    "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"
];

const DamageAnalyzer: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [result, setResult] = useState<DamageResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [placeName, setPlaceName] = useState('');
    const [district, setDistrict] = useState('');
    const [description, setDescription] = useState('');
    const [showHistory, setShowHistory] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Pointing to the Main Backend (which proxies to Microservice)
    const MICROSERVICE_URL = 'http://localhost:5000/predict';
    const REPORT_URL = 'http://localhost:5000/api/reports';

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
            setSaveSuccess(false);
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
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

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

    const handleSaveReport = async () => {
        if (!selectedFile || !result) return;

        if (!placeName || !district) {
            setError("Please fill in Place Name and District to save.");
            return;
        }

        setIsSaving(true);
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('place_name', placeName);
        formData.append('district', district);
        formData.append('description', description);
        formData.append('damage_type', result.prediction);
        formData.append('confidence', result.confidence.toString());

        try {
            const response = await fetch(REPORT_URL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Failed to save report');

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000); // Reset success msg
        } catch (err: any) {
            setError("Failed to save report: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const resetSelection = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
        setSaveSuccess(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
                <h3 className="font-serif font-bold text-stone-800 flex items-center gap-2">
                    <Camera size={18} className="text-rose-900" />
                    Monument Doctor
                </h3>
                <button
                    onClick={() => setShowHistory(true)}
                    className="text-xs bg-stone-200 hover:bg-stone-300 text-stone-700 px-2 py-1 rounded-full font-medium flex items-center gap-1 transition-colors"
                >
                    <History size={12} /> History
                </button>
            </div>

            <div className="p-5 space-y-4">
                {/* Form Inputs */}
                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-bold text-stone-500 uppercase">Place Name</label>
                        <input
                            type="text"
                            className="w-full border-b border-stone-300 py-1 text-sm focus:outline-none focus:border-rose-800 bg-transparent"
                            placeholder="e.g. Belur Temple"
                            value={placeName}
                            onChange={(e) => setPlaceName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-stone-500 uppercase">District</label>
                        <select
                            className="w-full border-b border-stone-300 py-1 text-sm focus:outline-none focus:border-rose-800 bg-transparent"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                        >
                            <option value="">Select District</option>
                            {KARNATAKA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-stone-500 uppercase">Description</label>
                        <textarea
                            className="w-full border border-stone-200 rounded p-2 text-sm focus:outline-none focus:border-rose-300 mt-1"
                            rows={3}
                            placeholder="Where is the damage located? Describe it..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                {!selectedFile ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center cursor-pointer hover:bg-stone-50 hover:border-rose-300 transition-colors group"
                    >
                        <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-rose-50 text-stone-400 group-hover:text-rose-500 transition-colors">
                            <Upload size={24} />
                        </div>
                        <p className="text-sm font-medium text-stone-700">Upload Photo</p>
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
                                className="w-full py-2.5 bg-rose-900 text-white rounded-lg font-bold text-sm hover:bg-rose-800 transition-colors shadow-sm"
                            >
                                Analyze Condition
                            </button>
                        )}

                        {isAnalyzing && (
                            <div className="text-center py-4 text-stone-500 text-sm flex items-center justify-center gap-2">
                                <Loader2 size={16} className="animate-spin text-rose-600" />
                                Analyzing...
                            </div>
                        )}

                        {result && (
                            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Result</span>
                                    <span className="text-xs font-bold bg-white px-2 py-0.5 rounded shadow-sm text-emerald-700">
                                        {(result.confidence * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-emerald-900 mb-1 flex items-center gap-2">
                                    <Check size={18} />
                                    {result.prediction.replace('_', ' ')}
                                </h4>

                                <button
                                    onClick={handleSaveReport}
                                    disabled={isSaving || saveSuccess}
                                    className={`mt-3 w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors ${saveSuccess
                                        ? 'bg-green-600 text-white'
                                        : 'bg-stone-800 text-white hover:bg-stone-900'
                                        }`}
                                >
                                    {isSaving ? <Loader2 size={14} className="animate-spin" /> :
                                        saveSuccess ? <Check size={14} /> : <Save size={14} />}
                                    {saveSuccess ? 'Saved!' : 'Save Report'}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg flex items-start gap-2 border border-red-100">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </div>
                )}

                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
            </div>

            {/* Dashboard Modal */}
            {showHistory && <DamageDashboard onClose={() => setShowHistory(false)} />}
        </div>
    );
};

export default DamageAnalyzer;
