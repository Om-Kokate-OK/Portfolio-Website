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
            <div className="min-h-screen bg-resend-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-resend-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-resend-black text-white py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-resend-indigo-400 to-resend-purple-400 bg-clip-text text-transparent">
                        Certificates
                    </h1>
                    <p className="text-xl text-resend-gray-300 max-w-2xl mx-auto">
                        Showcasing my achievements and certifications from various competitions and programs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificates.map((certificate) => (
                        <div
                            key={certificate._id}
                            onClick={() => openModal(certificate)}
                            className="bg-resend-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-resend-gray-800 hover:border-resend-indigo-500"
                        >
                            <div className="aspect-video bg-resend-gray-800 flex items-center justify-center">
                                {certificate.image_url ? (
                                    <img
                                        src={certificate.image_url}
                                        alt={certificate.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <Award className="w-16 h-16 text-resend-gray-600" />
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-resend-indigo-400 transition-colors">
                                    {certificate.title}
                                </h3>
                                <p className="text-resend-indigo-400 font-medium mb-2">
                                    {certificate.issuer}
                                </p>
                                <p className="text-resend-gray-400 text-sm mb-3">
                                    {formatDate(certificate.date_issued)}
                                </p>
                                {certificate.description && (
                                    <p className="text-resend-gray-300 text-sm line-clamp-3">
                                        {certificate.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {certificates.length === 0 && (
                    <div className="text-center py-16">
                        <Award className="w-24 h-24 text-resend-gray-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-resend-gray-400 mb-2">
                            No certificates yet
                        </h3>
                        <p className="text-resend-gray-500">
                            Certificates will appear here once added.
                        </p>
                    </div>
                )}

                {/* Modal */}
                {selectedCertificate && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                        <div className="bg-resend-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                            <div className="flex justify-between items-center p-6 border-b border-resend-gray-800">
                                <h2 className="text-2xl font-bold text-white">
                                    {selectedCertificate.title}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="text-resend-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div>
                                    <div className="space-y-4">
                                        {selectedCertificate.image_url && (
                                            <div className="mb-6">
                                                <img
                                                    src={selectedCertificate.image_url}
                                                    alt={selectedCertificate.title}
                                                    className="w-full rounded-lg max-w-md mx-auto"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-lg font-semibold text-resend-indigo-400 mb-1">
                                                Issuer
                                            </h3>
                                            <p className="text-white">{selectedCertificate.issuer}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-resend-indigo-400 mb-1">
                                                Date Issued
                                            </h3>
                                            <p className="text-white">{formatDate(selectedCertificate.date_issued)}</p>
                                        </div>

                                        {selectedCertificate.description && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-resend-indigo-400 mb-1">
                                                    Description
                                                </h3>
                                                <p className="text-resend-gray-300 leading-relaxed">
                                                    {selectedCertificate.description}
                                                </p>
                                            </div>
                                        )}

                                        {selectedCertificate.credential_url && (
                                            <div>
                                                <a
                                                    href={selectedCertificate.credential_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center space-x-2 bg-resend-indigo-500 hover:bg-resend-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    <span>View Credential</span>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}