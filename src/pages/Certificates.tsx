import { useEffect, useState } from 'react';
import { Award, ExternalLink, X } from 'lucide-react';
import { api } from '../lib/api';
import { useRouter } from '../hooks/useRouter';

interface Certificate {
    _id: string;
    title: string;
    issuer: string;
    date_issued: string;
    description?: string;
    image_url?: string;
    credential_url?: string;
    featured: boolean;
    display_order: number;
    created_at: string;
}

export default function Certificates() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
    const [loading, setLoading] = useState(true);
    const { currentPath } = useRouter();


    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await api.get('/certificates');
                setCertificates(response.data);

                const pathParts = currentPath.split('/');
                if (pathParts.length === 3 && pathParts[1] === 'certificates') {
                    const certificateId = pathParts[2];
                    const certificate = response.data.find((c: Certificate) => c._id === certificateId);
                    if (certificate) {
                        setSelectedCertificate(certificate);
                    }
                }
            } catch (error) {
                console.error('Error fetching certificates:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, [currentPath]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const openModal = (certificate: Certificate) => {
        setSelectedCertificate(certificate);
    };

    const closeModal = () => {
        setSelectedCertificate(null);
    };

if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white py-24 relative overflow-hidden">
            {/* Background Cyber Grid */}
            <div className="absolute inset-0 cyber-grid opacity-[0.06] pointer-events-none"></div>

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="text-center mb-20 space-y-4">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 shadow-neon-cyan/5 mx-auto">
                        <Award className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Verified Credentials</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                        Certifications
                    </h1>
                    <p className="text-slate-400 font-light max-w-2xl mx-auto text-lg leading-relaxed">
                        Industry-recognized professional validations and competitive achievements built over years of engineering.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificates.map((certificate) => (
                        <div
                            key={certificate._id}
                            onClick={() => openModal(certificate)}
                            className="bg-white/[0.02] hover:bg-white/[0.05] rounded-3xl overflow-hidden border border-white/5 hover:border-cyan-500/30 shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between group"
                        >
                            <div>
                                <div className="aspect-video bg-slate-950 flex items-center justify-center p-3 relative overflow-hidden">
                                    {certificate.image_url ? (
                                        <img
                                            src={certificate.image_url}
                                            alt={certificate.title}
                                            className="w-full h-full object-contain rounded-2xl group-hover:scale-[1.03] transition-all duration-500"
                                        />
                                    ) : (
                                        <Award className="w-12 h-12 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                                    )}
                                </div>
                                <div className="p-6 space-y-2">
                                    <h3 className="text-lg font-black tracking-tight text-white group-hover:text-cyan-400 transition-all">
                                        {certificate.title}
                                    </h3>
                                    <p className="text-cyan-500 text-xs font-bold uppercase tracking-widest">
                                        {certificate.issuer}
                                    </p>
                                    <p className="text-slate-500 text-[10px] font-bold">
                                        Issued {formatDate(certificate.date_issued)}
                                    </p>
                                </div>
                            </div>
                            
                            {certificate.description && (
                                <div className="p-6 pt-0 border-t border-white/5 mt-4">
                                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 pt-4">
                                        {certificate.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {certificates.length === 0 && (
                    <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl max-w-xl mx-auto">
                        <Award className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-1">
                            No credentials loaded
                        </h3>
                        <p className="text-slate-500 text-sm">
                            Certifications will be rendered here once configured.
                        </p>
                    </div>
                )}

                {/* Cyber Glass Modal */}
                {selectedCertificate && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-950 border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
                            <div className="sticky top-0 bg-slate-950/80 backdrop-blur-md border-b border-white/5 p-6 flex justify-between items-center z-10">
                                <div className="flex items-center space-x-3">
                                    <Award className="w-5 h-5 text-cyan-400" />
                                    <h2 className="text-xl font-black uppercase tracking-tight text-white">
                                        Credential Detail
                                    </h2>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-slate-400 hover:text-white transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                {selectedCertificate.image_url && (
                                    <div className="bg-slate-900/60 p-3 rounded-2xl border border-white/5 flex items-center justify-center">
                                        <img
                                            src={selectedCertificate.image_url}
                                            alt={selectedCertificate.title}
                                            className="max-w-xs w-full object-contain rounded-xl"
                                        />
                                    </div>
                                )}
                                
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-1">
                                            Certification Title
                                        </h3>
                                        <p className="text-white font-bold text-lg">{selectedCertificate.title}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-1">
                                                Issuing Authority
                                            </h3>
                                            <p className="text-slate-300 font-medium text-sm">{selectedCertificate.issuer}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-1">
                                                Issue Date
                                            </h3>
                                            <p className="text-slate-300 font-medium text-sm">{formatDate(selectedCertificate.date_issued)}</p>
                                        </div>
                                    </div>

                                    {selectedCertificate.description && (
                                        <div className="border-t border-white/5 pt-4">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-1">
                                                Description & Skills
                                            </h3>
                                            <p className="text-slate-300 leading-relaxed text-sm font-light">
                                                {selectedCertificate.description}
                                            </p>
                                        </div>
                                    )}

                                    {selectedCertificate.credential_url && (
                                        <div className="border-t border-white/5 pt-6 flex">
                                            <a
                                                href={selectedCertificate.credential_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-neon-cyan/20 transition-all active:scale-95"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                <span>Verify Credential Integrity</span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}