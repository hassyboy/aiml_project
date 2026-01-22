import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Loader2, Calendar, MapPin, AlertTriangle, Check, RefreshCw, X, Trash2, FileText } from 'lucide-react';

interface DamageReport {
    _id: string;
    place_name: string;
    district: string;
    description: string;
    damage_type: string;
    confidence: number;
    image_path: string;
    timestamp: string;
}

const DamageDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [reports, setReports] = useState<DamageReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const API_URL = "http://localhost:5000/api/reports";
    const BASE_URL = "http://localhost:5000"; // For images

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Failed to fetch reports");
            const data = await res.json();
            setReports(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reportId: string, placeName: string) => {
        if (!confirm(`Delete report for "${placeName}"? This cannot be undone.`)) {
            return;
        }

        try {
            setDeletingId(reportId);
            const res = await fetch(`${API_URL}/${reportId}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error("Failed to delete report");
            // Remove from local state
            setReports(prev => prev.filter(r => r._id !== reportId));
        } catch (err: any) {
            setError("Delete failed: " + err.message);
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        fetchReports();
        // Disabling scroll on body when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const getDamageColor = (type: string) => {
        return type === 'No_Damage' ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
            : 'text-rose-600 bg-rose-50 border-rose-200';
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-stone-900">Damage Reports History</h2>
                        <p className="text-stone-500 text-sm">Monitor saved preservation records</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={fetchReports} className="p-2 text-stone-500 hover:bg-stone-200 rounded-full transition-colors" title="Refresh">
                            <RefreshCw size={20} />
                        </button>
                        <button onClick={onClose} className="p-2 text-stone-500 hover:bg-rose-100 hover:text-rose-600 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-stone-50/50">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-stone-500">
                            <Loader2 size={32} className="animate-spin text-rose-800 mb-2" />
                            <p>Loading records...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center p-10 bg-red-50 rounded-xl border border-red-100 text-red-600">
                            <AlertTriangle size={32} className="mx-auto mb-2" />
                            <p>{error}</p>
                            <button onClick={fetchReports} className="mt-4 text-sm underline hover:text-red-800">Try Again</button>
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-stone-700">No Reports Found</h3>
                            <p className="text-stone-500">Analyze a monument and save a report to see it here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reports.map((report) => (
                                <div key={report._id} className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                    {/* Image */}
                                    <div className="aspect-video bg-stone-100 relative group overflow-hidden">
                                        <img
                                            src={BASE_URL + report.image_path}
                                            alt={report.place_name}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found' }}
                                        />
                                        <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 text-white text-xs font-bold backdrop-blur-sm">
                                            {(report.confidence * 100).toFixed(0)}% Conf.
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-stone-900 line-clamp-1">{report.place_name}</h3>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDamageColor(report.damage_type)}`}>
                                                {report.damage_type.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-3">
                                            <MapPin size={12} />
                                            <span>{report.district}</span>
                                            <span className="text-stone-300">•</span>
                                            <Calendar size={12} />
                                            <span>{new Date(report.timestamp).toLocaleDateString()}</span>
                                        </div>

                                        <p className="text-sm text-stone-600 line-clamp-3 mb-4 flex-1 italic">
                                            "{report.description || 'No description provided.'}"
                                        </p>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDelete(report._id, report.place_name)}
                                            disabled={deletingId === report._id}
                                            className="mt-auto w-full py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {deletingId === report._id ? (
                                                <Loader2 size={14} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={14} />
                                            )}
                                            {deletingId === report._id ? 'Deleting...' : 'Delete Report'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DamageDashboard;
