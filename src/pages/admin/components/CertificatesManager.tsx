import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, X, Save, Loader, Award, Eye } from 'lucide-react';
import { api } from '../../../lib/api';

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

interface CertificateInsert {
    title: string;
    issuer: string;
    date_issued: string;
    description?: string;
    image_url?: string;
    credential_url?: string;
    featured: boolean;
    display_order: number;
}

const convertToDirectImageUrl = (url: string) => {
    // GitHub blob → raw
    if (url.includes('github.com') && url.includes('/blob/')) {
        return url
            .replace('github.com', 'raw.githubusercontent.com')
            .replace('/blob/', '/');
    }

    // Google Drive → direct image
    if (url.includes('drive.google.com')) {
        const match = url.match(/\/d\/([^/]+)/);
        if (match) {
            return `https://drive.google.com/uc?export=view&id=${match[1]}`;
        }
    }

    return url;
};

export default function CertificatesManager() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState<CertificateInsert>({
        title: '',
        issuer: '',
        date_issued: '',
        description: '',
        image_url: '',
        credential_url: '',
        featured: false,
        display_order: 0,
    });

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const response = await api.get('/certificates');
            setCertificates(response.data);
        } catch (error) {
            console.error('Error fetching certificates:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            issuer: '',
            date_issued: '',
            description: '',
            image_url: '',
            credential_url: '',
            featured: false,
            display_order: 0,
        });
        setEditingCertificate(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const processedData = {
                ...formData,
                image_url: formData.image_url ? convertToDirectImageUrl(formData.image_url) : undefined,
            };

            if (editingCertificate) {
                await api.put(`/certificates/${editingCertificate._id}`, processedData);
            } else {
                await api.post('/certificates', processedData);
            }

            await fetchCertificates();
            resetForm();
        } catch (error) {
            console.error('Error saving certificate:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (certificate: Certificate) => {
        setEditingCertificate(certificate);
        setFormData({
            title: certificate.title,
            issuer: certificate.issuer,
            date_issued: certificate.date_issued.split('T')[0], // Format for date input
            description: certificate.description || '',
            image_url: certificate.image_url || '',
            credential_url: certificate.credential_url || '',
            featured: certificate.featured,
            display_order: certificate.display_order,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this certificate shard?')) return;

        try {
            await api.delete(`/certificates/${id}`);
            await fetchCertificates();
        } catch (error) {
            console.error('Error deleting certificate:', error);
        }
    };

    const toggleFeatured = async (certificate: Certificate) => {
        try {
            await api.put(`/certificates/${certificate._id}`, {
                ...certificate,
                featured: !certificate.featured,
            });
            await fetchCertificates();
        } catch (error) {
            console.error('Error updating certificate:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 font-mono text-xs uppercase tracking-widest text-[#888888]">
                <Loader className="w-8 h-8 animate-spin text-white mr-3" />
                <span>Fetching certifications...</span>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 select-none">
            
            {/* Title & Setup Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-8 relative">
                <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#888888]">/ Timeline Credentials</span>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white">SYS_CERTIFICATES</h1>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-4 border border-white bg-white hover:bg-black text-black hover:text-white font-mono text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Register Certificate</span>
                    </button>
                )}
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-black border border-white/10 p-8 rounded-none relative space-y-6">
                    {/* Subtle decorative brutalist corner elements */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-white"></div>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-white"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white"></div>
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white"></div>

                    <div className="flex justify-between items-center border-b border-white/10 pb-4 font-mono">
                        <h3 className="text-sm font-black uppercase text-white tracking-widest">
                            {editingCertificate ? '/ Edit Certificate Shard' : '/ Register Certificate Shard'}
                        </h3>
                        <button
                            onClick={resetForm}
                            className="text-[#888888] hover:text-white p-1 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 font-mono">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-2">
                                    Certificate Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-black border border-white/10 focus:border-white outline-none p-3 text-white text-xs uppercase tracking-widest transition-colors rounded-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-2">
                                    Issuer / Institution *
                                </label>
                                <input
                                    type="text"
                                    value={formData.issuer}
                                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                                    className="w-full bg-black border border-white/10 focus:border-white outline-none p-3 text-white text-xs uppercase tracking-widest transition-colors rounded-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-2">
                                    Date Issued *
                                </label>
                                <input
                                    type="date"
                                    value={formData.date_issued}
                                    onChange={(e) => setFormData({ ...formData, date_issued: e.target.value })}
                                    className="w-full bg-black border border-white/10 focus:border-white outline-none p-3 text-white text-xs uppercase tracking-widest transition-colors rounded-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-2">
                                    Display Order Sequence
                                </label>
                                <input
                                    type="number"
                                    value={formData.display_order}
                                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-black border border-white/10 focus:border-white outline-none p-3 text-white text-xs uppercase tracking-widest transition-colors rounded-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-2">
                                Credential Description / Core Learnings
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full bg-black border border-white/10 focus:border-white outline-none p-3 text-white text-xs transition-colors rounded-none resize-none"
                                placeholder="DETAIL THE CERTIFICATE OR SKILLS VERIFIED..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-2">
                                    Image URL (Drive/Asset)
                                </label>
                                <input
                                    type="url"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full bg-black border border-white/10 focus:border-white outline-none p-3 text-white text-xs transition-colors rounded-none"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-2">
                                    Credential URL (Verification)
                                </label>
                                <input
                                    type="url"
                                    value={formData.credential_url}
                                    onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                                    className="w-full bg-black border border-white/10 focus:border-white outline-none p-3 text-white text-xs transition-colors rounded-none"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 py-2">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="w-4 h-4 bg-black border border-white/10 text-white rounded-none focus:ring-0 outline-none cursor-pointer"
                            />
                            <label htmlFor="featured" className="text-xs uppercase tracking-widest text-slate-300 cursor-pointer">
                                Highlight / Featured Certificate
                            </label>
                        </div>

                        <div className="flex justify-end items-center gap-4 pt-4 border-t border-white/10">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-5 py-2 border border-white/10 hover:border-white text-slate-400 hover:text-white transition-all text-xs uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-3 border border-white bg-white hover:bg-black text-black hover:text-white font-black uppercase text-xs tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Save Shard</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Certificates List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
                {certificates.map((certificate) => (
                    <div
                        key={certificate._id}
                        className="bg-black border border-white/10 p-6 rounded-none flex flex-col justify-between hover:border-white transition-all duration-300 group relative"
                    >
                        <div className="absolute -top-px -left-px w-1.5 h-1.5 bg-[#888888] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute -top-px -right-px w-1.5 h-1.5 bg-[#888888] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-white font-bold text-base uppercase tracking-tight line-clamp-2">
                                        {certificate.title}
                                    </h3>
                                    <p className="text-[#888888] text-xs uppercase tracking-widest mt-1.5 font-bold">
                                        / {certificate.issuer}
                                    </p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
                                        Date: {new Date(certificate.date_issued).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }).toUpperCase()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => toggleFeatured(certificate)}
                                    className={`p-1.5 border border-white/10 hover:border-white transition-all ${
                                        certificate.featured
                                            ? 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5'
                                            : 'text-slate-500 hover:text-yellow-400'
                                    }`}
                                >
                                    <Star className={`w-4 h-4 ${certificate.featured ? 'fill-current' : ''}`} />
                                </button>
                            </div>

                            {certificate.image_url && (
                                <div className="mb-4 border border-white/10 h-32 overflow-hidden bg-neutral-900 flex items-center justify-center">
                                    <img
                                        src={certificate.image_url}
                                        alt={certificate.title}
                                        className="w-full h-full object-cover filter brightness-75 group-hover:brightness-100 transition-all duration-300"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop&q=80';
                                        }}
                                    />
                                </div>
                            )}

                            {certificate.description && (
                                <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-2">
                                    {certificate.description}
                                </p>
                            )}
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex gap-2">
                                {certificate.credential_url && (
                                    <a
                                        href={certificate.credential_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 border border-white/10 hover:border-white text-slate-400 hover:text-white transition-all"
                                        title="Verify Credential"
                                    >
                                        <Eye size={12} />
                                    </a>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(certificate)}
                                    className="p-2 border border-white/10 hover:border-white text-slate-400 hover:text-white transition-all"
                                    title="Edit Shard"
                                >
                                    <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(certificate._id)}
                                    className="p-2 border border-red-500/20 text-red-500 hover:border-red-500 hover:bg-red-500/10 transition-all"
                                    title="Delete Shard"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {certificates.length === 0 && (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-none">
                    <Award className="w-12 h-12 text-[#888888] mx-auto mb-4" />
                    <p className="text-xs font-mono uppercase tracking-widest text-[#888888]">No certificates registered in timeline yet.</p>
                </div>
            )}
        </div>
    );
}