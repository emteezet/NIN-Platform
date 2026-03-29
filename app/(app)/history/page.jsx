"use client";

import { useEffect, useState, useRef } from "react";
import { 
  FileText, 
  Download, 
  Search, 
  Loader2, 
  Calendar, 
  ShieldCheck, 
  CreditCard,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import DownloadButton from "@/components/DownloadButton";
import PremiumPlasticCard from "@/components/PremiumPlasticCard";
import NinRegularSlip from "@/components/NinRegularSlip";
import ImprovedNinSlip from "@/components/ImprovedNinSlip";

export default function HistoryPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const documentRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/verifications");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch history");
      setRecords(data.records);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadClick = async (recordId) => {
    setLoadingId(recordId);
    try {
      const res = await fetch(`/api/verifications/${recordId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch details");
      setSelectedRecord(data.record);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#19325C] mb-4" />
        <p className="text-slate-500 font-medium tracking-tight">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#19325C] tracking-tight">My Generated Slips</h1>
        <p className="text-slate-500 mt-1">A historical list of all your NIN/BVN verifications.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm mb-6 flex items-center gap-2">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      {records.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <FileText className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No history found</h2>
          <p className="text-slate-500 max-w-xs mx-auto">Your generated slips will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {records.map((record) => (
            <div 
              key={record.id}
              className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between gap-4 group hover:border-[#19325C]/30 transition-all shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${record.type.includes('NIN') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                  {record.type.includes('NIN') ? <ShieldCheck className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-none mb-2">
                    {record.identifier}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-black">
                      {record.slip_type.toUpperCase()} SLIP
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(record.created_at).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDownloadClick(record.id)}
                disabled={!!loadingId}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#19325C] text-white rounded-xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#19325C]/10"
              >
                {loadingId === record.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden text-lg"><Download className="w-5 h-5" /></span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Re-download Modal/Hidden Area */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in duration-300 text-center">
                 <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Download className="w-10 h-10 text-emerald-600" />
                 </div>
                 
                 <h2 className="text-2xl font-black text-[#19325C] mb-2">Ready to Download</h2>
                 <p className="text-slate-500 mb-8">Click the button below to generate and save your {selectedRecord.slip_type} slip.</p>

                 {/* Hidden rendering area for PDF */}
                 <div ref={documentRef} style={{ position: "absolute", left: "-9999px", top: 0 }}>
                    {selectedRecord.slip_type === "premium" && (
                        <div className="w-[500px] bg-white">
                          <PremiumPlasticCard user={selectedRecord.user} qrCodeData={selectedRecord.user.qrCode} forwardedRef={documentRef} />
                        </div>
                    )}
                    {selectedRecord.slip_type === "improved" && (
                        <div className="w-[500px] bg-white">
                          <ImprovedNinSlip user={selectedRecord.user} qrCodeData={selectedRecord.user.qrCode} forwardedRef={documentRef} />
                        </div>
                    )}
                    {selectedRecord.slip_type === "regular" && (
                        <div className="w-[850px] bg-white">
                          <NinRegularSlip user={selectedRecord.user} forwardedRef={documentRef} />
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <DownloadButton 
                        templateRef={documentRef} 
                        fileName={`NIN-Slip-${selectedRecord.user.nin || selectedRecord.identifier}`} 
                        slipType={(selectedRecord.slip_type === "premium" || selectedRecord.slip_type === "improved") ? "plastic" : "full"} 
                        renderCustom={({ onClick, isLoading }) => (
                            <button 
                                onClick={onClick}
                                disabled={isLoading}
                                className="w-full py-5 bg-[#008751] text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                            >
                                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
                                {isLoading ? "Generating..." : "Download Now"}
                            </button>
                        )}
                    />
                    <button 
                        onClick={() => setSelectedRecord(null)}
                        className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
