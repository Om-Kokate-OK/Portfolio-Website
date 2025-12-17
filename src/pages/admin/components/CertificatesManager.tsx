import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, X, Save, Loader, Award } from 'lucide-react';
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
        if (!confirm('Are you sure you want to delete this certificate?')) return;

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
            <div className="flex items-center justify-center py-8">
                <Loader className="w-8 h-8 animate-spin text-resend-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                    <Award className="w-6 h-6" />
                    <span>Certificates</span>
                </h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-resend-indigo-500 hover:bg-resend-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Certificate</span>
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-resend-gray-900 rounded-lg p-6 border border-resend-gray-800">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-white">
                            {editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}
                        </h3>
                        <button
                            onClick={resetForm}
                            className="text-resend-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-resend-gray-300 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-resend-gray-800 border border-resend-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-resend-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-resend-gray-300 mb-1">
                                    Issuer *
                                </label>
                                <input
                                    type="text"
                                    value={formData.issuer}
                                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                                    className="w-full bg-resend-gray-800 border border-resend-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-resend-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-resend-gray-300 mb-1">
                                    Date Issued *
                                </label>
                                <input
                                    type="date"
                                    value={formData.date_issued}
                                    onChange={(e) => setFormData({ ...formData, date_issued: e.target.value })}
                                    className="w-full bg-resend-gray-800 border border-resend-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-resend-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-resend-gray-300 mb-1">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    value={formData.display_order}
                                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-resend-gray-800 border border-resend-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-resend-indigo-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-resend-gray-300 mb-1">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full bg-resend-gray-800 border border-resend-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-resend-indigo-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-resend-gray-300 mb-1">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full bg-resend-gray-800 border border-resend-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-resend-indigo-500"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-resend-gray-300 mb-1">
                                    Credential URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.credential_url}
                                    onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                                    className="w-full bg-resend-gray-800 border border-resend-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-resend-indigo-500"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="rounded border-resend-gray-700 text-resend-indigo-500 focus:ring-resend-indigo-500"
                            />
                            <label htmlFor="featured" className="text-sm text-resend-gray-300">
                                Featured Certificate
                            </label>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-resend-gray-300 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-resend-indigo-500 hover:bg-resend-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                            >
                                {saving && <Loader className="w-4 h-4 animate-spin" />}
                                <Save className="w-4 h-4" />
                                <span>{saving ? 'Saving...' : 'Save'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Certificates List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((certificate) => (
                    <div
                        key={certificate._id}
                        className="bg-resend-gray-900 rounded-lg p-6 border border-resend-gray-800 hover:border-resend-indigo-500 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white mb-1">
                                    {certificate.title}
                                </h3>
                                <p className="text-resend-indigo-400 text-sm mb-2">
                                    {certificate.issuer}
                                </p>
                                <p className="text-resend-gray-400 text-sm">
                                    {new Date(certificate.date_issued).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => toggleFeatured(certificate)}
                                className={`p-1 rounded transition-colors ${certificate.featured
                                        ? 'text-yellow-400 hover:text-yellow-300'
                                        : 'text-resend-gray-600 hover:text-yellow-400'
                                    }`}
                            >
                                <Star className={`w-5 h-5 ${certificate.featured ? 'fill-current' : ''}`} />
                            </button>
                        </div>

                        {certificate.image_url && (
                            <div className="mb-4">
                                <img
                                    src={certificate.image_url}
                                    alt={certificate.title}
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                            </div>
                        )}

                        {certificate.description && (
                            <p className="text-resend-gray-300 text-sm mb-4 line-clamp-2">
                                {certificate.description}
                            </p>
                        )}

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => handleEdit(certificate)}
                                className="p-2 text-resend-gray-400 hover:text-resend-indigo-400 transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(certificate._id)}
                                className="p-2 text-resend-gray-400 hover:text-red-400 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {certificates.length === 0 && (
                <div className="text-center py-16">
                    <Award className="w-16 h-16 text-resend-gray-600 mx-auto mb-4" />
                    <p className="text-resend-gray-500">No certificates added yet.</p>
                </div>
            )}
        </div>
    );
}