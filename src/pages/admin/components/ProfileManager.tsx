import React, { useState, useEffect, FormEvent, useRef } from 'react';
import {
  Save,
  Loader,
  Upload,
  FileText,
  Image as ImageIcon,
  Eye,
  AlertTriangle,
  Plus,
  Trash2,
  Sliders,
  Briefcase,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { api } from '../../../lib/api';

interface WorkHistoryItem {
  _id?: string;
  role: string;
  company: string;
  duration: string;
}

interface TestimonialItem {
  _id?: string;
  quote: string;
  client: string;
  title: string;
  date: string;
}

interface ServiceItem {
  _id?: string;
  title: string;
  icon: string;
  description: string;
  skills: string[];
}

interface Profile {
  _id: string;
  full_name: string;
  headline: string;
  about_me: string;
  email: string;
  phone?: string;
  location?: string;
  profile_image_url?: string;
  resume_url?: string;
  linkedin_url?: string;
  github_url?: string;
  work_history: WorkHistoryItem[];
  testimonials: TestimonialItem[];
  services: ServiceItem[];
}

export default function ProfileManager() {
  const [profile, setProfile] = useState<Profile>({
    _id: '',
    full_name: '',
    headline: '',
    about_me: '',
    email: '',
    phone: '',
    location: '',
    profile_image_url: '',
    resume_url: '',
    linkedin_url: '',
    github_url: '',
    work_history: [],
    testimonials: [],
    services: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Active Admin Subsection Tab State
  const [activeTab, setActiveTab] = useState<'info' | 'assets' | 'services' | 'history' | 'testimonials'>('info');

  // Upload States
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [resumeError, setResumeError] = useState('');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      if (response.data) {
        setProfile({
          ...response.data,
          work_history: response.data.work_history || [],
          testimonials: response.data.testimonials || [],
          services: response.data.services || []
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setAvatarError('Only jpeg, jpg, png, webp, and gif images are allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setAvatarError('Image size must be under 10MB.');
      return;
    }

    setUploadingAvatar(true);
    setAvatarError('');
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await api.post('/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data && res.data.url) {
        setProfile(prev => ({ ...prev, profile_image_url: res.data.url }));
      }
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      setAvatarError(err.response?.data?.error || 'Failed to upload image.');
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setResumeError('Only PDF documents are allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setResumeError('Resume size must be under 10MB.');
      return;
    }

    setUploadingResume(true);
    setResumeError('');
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await api.post('/upload/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data && res.data.url) {
        setProfile(prev => ({ ...prev, resume_url: res.data.url }));
      }
    } catch (err: any) {
      console.error('Error uploading resume:', err);
      setResumeError(err.response?.data?.error || 'Failed to upload resume.');
    } finally {
      setUploadingResume(false);
      if (resumeInputRef.current) resumeInputRef.current.value = '';
    }
  };

  // --- Dynamic Services Handlers ---
  const handleAddService = () => {
    setProfile(prev => ({
      ...prev,
      services: [
        ...prev.services,
        { title: '', icon: 'Layout', description: '', skills: [] }
      ]
    }));
  };

  const handleUpdateService = (index: number, fields: Partial<ServiceItem>) => {
    setProfile(prev => {
      const updated = [...prev.services];
      updated[index] = { ...updated[index], ...fields };
      return { ...prev, services: updated };
    });
  };

  const handleDeleteService = (index: number) => {
    setProfile(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  // --- Dynamic Work History Handlers ---
  const handleAddWorkHistory = () => {
    setProfile(prev => ({
      ...prev,
      work_history: [
        ...prev.work_history,
        { role: '', company: '', duration: '' }
      ]
    }));
  };

  const handleUpdateWorkHistory = (index: number, fields: Partial<WorkHistoryItem>) => {
    setProfile(prev => {
      const updated = [...prev.work_history];
      updated[index] = { ...updated[index], ...fields };
      return { ...prev, work_history: updated };
    });
  };

  const handleDeleteWorkHistory = (index: number) => {
    setProfile(prev => ({
      ...prev,
      work_history: prev.work_history.filter((_, i) => i !== index)
    }));
  };

  // --- Dynamic Testimonials Handlers ---
  const handleAddTestimonial = () => {
    setProfile(prev => ({
      ...prev,
      testimonials: [
        ...prev.testimonials,
        { quote: '', client: '', title: '', date: '' }
      ]
    }));
  };

  const handleUpdateTestimonial = (index: number, fields: Partial<TestimonialItem>) => {
    setProfile(prev => {
      const updated = [...prev.testimonials];
      updated[index] = { ...updated[index], ...fields };
      return { ...prev, testimonials: updated };
    });
  };

  const handleDeleteTestimonial = (index: number) => {
    setProfile(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);

    try {
      console.log('Saving profile payload:', profile);
      const response = await api.put('/profile', profile);
      console.log('Saved profile response:', response.data);
      setProfile({
        ...response.data,
        work_history: response.data.work_history || [],
        testimonials: response.data.testimonials || [],
        services: response.data.services || []
      });
      setSuccess(true);
    } catch (error: unknown) {
      console.error('Error saving profile:', error);
      const err = error as { response?: { data?: { error?: string } } };
      setError(err.response?.data?.error || 'Failed to save profile configurations');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  const subTabs = [
    { id: 'info' as const, label: 'General Info', icon: Sliders },
    { id: 'assets' as const, label: 'Media Assets', icon: ImageIcon },
    { id: 'services' as const, label: 'Services Config', icon: Sparkles },
    { id: 'history' as const, label: 'Work History', icon: Briefcase },
    { id: 'testimonials' as const, label: 'Testimonials', icon: MessageSquare }
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-2">SYS_PROFILE_DASHBOARD</h1>
        <p className="font-mono text-xs text-[#888888] uppercase tracking-widest">
          Consolidated control center to change all client-facing layouts
        </p>
      </div>

      {/* Brutalist Sub navigation bar */}
      <div className="flex flex-wrap border-b border-white/10 mb-8 font-mono text-xs uppercase tracking-widest text-[#888888]">
        {subTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 border-t border-x border-transparent -mb-px transition-all ${
                activeTab === tab.id
                  ? 'border-white/10 bg-[#0d0d0d] text-white font-bold'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>/ {tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="bg-black border border-white/10 p-8 relative space-y-8">
        {/* Subtle decorative brutalist corner elements */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-white"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white"></div>

        {/* ================= TAB 1: GENERAL INFO ================= */}
        {activeTab === 'info' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-white/10 pb-4">
              <h3 className="font-mono text-sm uppercase tracking-widest text-white">/ Identity & Contact Information</h3>
              <p className="text-[10px] font-mono text-[#888888] mt-1">Configure foundational textual lines across the home page</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-3">
                  / Full Name
                </label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-white/10 focus:border-white focus:ring-0 outline-none text-white font-mono text-sm tracking-wide transition-colors"
                  placeholder="YOUR NAME"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-3">
                  / Email Coordinates
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-white/10 focus:border-white focus:ring-0 outline-none text-white font-mono text-sm tracking-wide transition-colors"
                  placeholder="EMAIL@DOMAIN.COM"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-3">
                / Headline / Core Designation
              </label>
              <input
                type="text"
                value={profile.headline}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-white/10 focus:border-white focus:ring-0 outline-none text-white font-mono text-sm tracking-wide transition-colors"
                placeholder="DISTRIBUTED SYSTEMS DEVELOPER | DESIGN CONNOISSEUR"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-3">
                / Biography / About Me
              </label>
              <textarea
                rows={6}
                value={profile.about_me}
                onChange={(e) => setProfile({ ...profile, about_me: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-white/10 focus:border-white focus:ring-0 outline-none text-white font-mono text-sm tracking-wide transition-colors resize-none"
                placeholder="DESCRIBE YOUR PHILOSOPHY, TECHNICAL SKILLSETS, AND VALUE VALUE PROPOSITION..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-3">
                  / Phone Vector
                </label>
                <input
                  type="tel"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-white/10 focus:border-white focus:ring-0 outline-none text-white font-mono text-sm tracking-wide transition-colors"
                  placeholder="+1 234 567 890"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-3">
                  / Location Base
                </label>
                <input
                  type="text"
                  value={profile.location || ''}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-white/10 focus:border-white focus:ring-0 outline-none text-white font-mono text-sm tracking-wide transition-colors"
                  placeholder="CITY, COUNTRY"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-3">
                  / LinkedIn URL
                </label>
                <input
                  type="url"
                  value={profile.linkedin_url || ''}
                  onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-white/10 focus:border-white focus:ring-0 outline-none text-white font-mono text-sm tracking-wide transition-colors"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-3">
                  / GitHub URL
                </label>
                <input
                  type="url"
                  value={profile.github_url || ''}
                  onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-white/10 focus:border-white focus:ring-0 outline-none text-white font-mono text-sm tracking-wide transition-colors"
                  placeholder="https://github.com/username"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: MEDIA ASSETS ================= */}
        {activeTab === 'assets' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-white/10 pb-4">
              <h3 className="font-mono text-sm uppercase tracking-widest text-white">/ Dynamic File & Document Pipelines</h3>
              <p className="text-[10px] font-mono text-[#888888] mt-1">
                Upload image profiles and resume PDFs natively to your database
              </p>
            </div>

            {/* Avatar upload */}
            <div className="space-y-4">
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#888888]">
                / Profile Photo File
              </label>
              
              <div className="bg-[#0a0a0a] border border-white/10 p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-24 h-24 border border-white/20 bg-black flex items-center justify-center overflow-hidden shrink-0">
                  {profile.profile_image_url ? (
                    <img
                      src={profile.profile_image_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-[#888888]" />
                  )}
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                      <Loader className="w-6 h-6 animate-spin text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-grow space-y-3 w-full text-center md:text-left">
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-white">/ Avatar Image Selector</h4>
                    <p className="text-[10px] font-mono text-[#888888] mt-1">
                      JPEG, JPG, PNG, WEBP, or GIF. Max payload size: 10MB.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                    <input
                      type="file"
                      ref={avatarInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingAvatar}
                      onClick={() => avatarInputRef.current?.click()}
                      className="flex items-center space-x-2 px-4 py-2 border border-white/20 hover:border-white bg-transparent hover:bg-white text-white hover:text-black font-mono text-[10px] uppercase tracking-widest transition-all duration-300 disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Avatar File</span>
                    </button>

                    {profile.profile_image_url && (
                      <button
                        type="button"
                        onClick={() => setProfile({ ...profile, profile_image_url: '' })}
                        className="px-4 py-2 border border-red-500/20 text-red-500 hover:border-red-500 hover:bg-red-500/10 font-mono text-[10px] uppercase tracking-widest transition-all duration-300"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {avatarError && (
                    <div className="flex items-center space-x-2 text-red-500 font-mono text-[10px] uppercase tracking-widest mt-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{avatarError}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-2 mt-2">
                  / Dynamic Avatar URL (Direct Link)
                </label>
                <input
                  type="url"
                  value={profile.profile_image_url || ''}
                  onChange={(e) => setProfile({ ...profile, profile_image_url: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-white/10 focus:border-white focus:ring-0 outline-none text-white font-mono text-sm tracking-wide transition-colors"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>

            <div className="border-t border-white/10 my-8"></div>

            {/* Resume Upload */}
            <div className="space-y-4">
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#888888]">
                / Resume PDF File
              </label>

              <div className="bg-[#0a0a0a] border border-white/10 p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-24 h-24 border border-white/20 bg-black flex items-center justify-center overflow-hidden shrink-0">
                  <FileText className="w-8 h-8 text-[#888888]" />
                  {uploadingResume && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                      <Loader className="w-6 h-6 animate-spin text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-grow space-y-3 w-full text-center md:text-left">
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-white">/ Resume PDF Selector</h4>
                    <p className="text-[10px] font-mono text-[#888888] mt-1">
                      PDF format documents only. Max size: 10MB.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                    <input
                      type="file"
                      ref={resumeInputRef}
                      onChange={handleResumeUpload}
                      accept="application/pdf"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingResume}
                      onClick={() => resumeInputRef.current?.click()}
                      className="flex items-center space-x-2 px-4 py-2 border border-white/20 hover:border-white bg-transparent hover:bg-white text-white hover:text-black font-mono text-[10px] uppercase tracking-widest transition-all duration-300 disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Resume File</span>
                    </button>

                    {profile.resume_url && (
                      <>
                        <a
                          href={profile.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-4 py-2 border border-white/10 hover:border-white text-white font-mono text-[10px] uppercase tracking-widest transition-all duration-300"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View PDF</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => setProfile({ ...profile, resume_url: '' })}
                          className="px-4 py-2 border border-red-500/20 text-red-500 hover:border-red-500 hover:bg-red-500/10 font-mono text-[10px] uppercase tracking-widest transition-all duration-300"
                        >
                          Clear
                        </button>
                      </>
                    )}
                  </div>

                  {resumeError && (
                    <div className="flex items-center space-x-2 text-red-500 font-mono text-[10px] uppercase tracking-widest mt-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{resumeError}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-2 mt-2">
                  / Dynamic Resume URL (Direct Link)
                </label>
                <input
                  type="url"
                  value={profile.resume_url || ''}
                  onChange={(e) => setProfile({ ...profile, resume_url: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-white/10 focus:border-white focus:ring-0 outline-none text-white font-mono text-sm tracking-wide transition-colors"
                  placeholder="https://example.com/resume.pdf"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: SERVICES CONFIG ================= */}
        {activeTab === 'services' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-mono text-sm uppercase tracking-widest text-white">/ Services & Core Offerings</h3>
                <p className="text-[10px] font-mono text-[#888888] mt-1">
                  Manage the dynamic cards rendered in the "What I Do Best" catalog on the landing page
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddService}
                className="flex items-center space-x-2 px-4 py-2 border border-white/20 hover:border-white bg-white/5 hover:bg-white text-white hover:text-black font-mono text-[10px] uppercase tracking-widest transition-all duration-300"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Service Column</span>
              </button>
            </div>

            {profile.services.length === 0 ? (
              <div className="border border-dashed border-white/10 p-12 text-center text-slate-500 font-mono text-xs uppercase tracking-wider">
                No custom services configured. Currently falling back to standard frontend/backend/cloud defaults.
              </div>
            ) : (
              <div className="space-y-6">
                {profile.services.map((service, idx) => (
                  <div key={idx} className="border border-white/10 bg-[#060606] p-6 relative space-y-4">
                    <div className="absolute top-4 right-4 flex items-center space-x-4">
                      <span className="font-mono text-xs text-[#888888]">Service #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(idx)}
                        className="p-1.5 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all rounded-md"
                        title="Delete Service Card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-widest text-[#888888] mb-2">
                          Service Title
                        </label>
                        <input
                          type="text"
                          value={service.title}
                          required
                          onChange={(e) => handleUpdateService(idx, { title: e.target.value })}
                          className="w-full px-3 py-2 bg-black border border-white/10 focus:border-white outline-none text-white font-mono text-xs uppercase tracking-widest transition-colors"
                          placeholder="e.g. Frontend Architecture"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-widest text-[#888888] mb-2">
                          Icon Core (Layout / Server / Database)
                        </label>
                        <select
                          value={service.icon}
                          onChange={(e) => handleUpdateService(idx, { icon: e.target.value })}
                          className="w-full px-3 py-2 bg-black border border-white/10 focus:border-white outline-none text-white font-mono text-xs uppercase tracking-widest transition-colors"
                        >
                          <option value="Layout">Layout (Frontend UI)</option>
                          <option value="Server">Server (Backend Logics)</option>
                          <option value="Database">Database (Cloud Databases)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[9px] uppercase tracking-widest text-[#888888] mb-2">
                        Description / Contribution Details
                      </label>
                      <textarea
                        rows={3}
                        value={service.description}
                        required
                        onChange={(e) => handleUpdateService(idx, { description: e.target.value })}
                        className="w-full px-3 py-2 bg-black border border-white/10 focus:border-white outline-none text-white font-mono text-xs transition-colors"
                        placeholder="Detail core contributions, pipelines, or benchmarks in this section..."
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[9px] uppercase tracking-widest text-[#888888] mb-2">
                        Display Skills Pill Injector (Comma-Separated)
                      </label>
                      <input
                        type="text"
                        value={service.skills.join(', ')}
                        onChange={(e) =>
                          handleUpdateService(idx, {
                            skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          })
                        }
                        className="w-full px-3 py-2 bg-black border border-white/10 focus:border-white outline-none text-white font-mono text-xs transition-colors"
                        placeholder="e.g. React.js, Next.js, TypeScript, Framer Motion"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: WORK HISTORY ================= */}
        {activeTab === 'history' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-mono text-sm uppercase tracking-widest text-white">/ Dynamic Career & Work Timeline</h3>
                <p className="text-[10px] font-mono text-[#888888] mt-1">
                  Adjust rows inside the "Work History" careers module on the landing page
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddWorkHistory}
                className="flex items-center space-x-2 px-4 py-2 border border-white/20 hover:border-white bg-white/5 hover:bg-white text-white hover:text-black font-mono text-[10px] uppercase tracking-widest transition-all duration-300"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Career Row</span>
              </button>
            </div>

            {profile.work_history.length === 0 ? (
              <div className="border border-dashed border-white/10 p-12 text-center text-slate-500 font-mono text-xs uppercase tracking-wider">
                No career timeline custom inputs found. Currently falling back to standard historical rows.
              </div>
            ) : (
              <div className="space-y-6">
                {profile.work_history.map((job, idx) => (
                  <div key={idx} className="border border-white/10 bg-[#060606] p-6 relative space-y-4">
                    <div className="absolute top-4 right-4 flex items-center space-x-4">
                      <span className="font-mono text-xs text-[#888888]">Timeline Row #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteWorkHistory(idx)}
                        className="p-1.5 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all rounded-md"
                        title="Delete Career Row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-widest text-[#888888] mb-2">
                          Role Title
                        </label>
                        <input
                          type="text"
                          value={job.role}
                          required
                          onChange={(e) => handleUpdateWorkHistory(idx, { role: e.target.value })}
                          className="w-full px-3 py-2 bg-black border border-white/10 focus:border-white outline-none text-white font-mono text-xs uppercase tracking-widest transition-colors"
                          placeholder="e.g. Lead Distributed Engineer"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-widest text-[#888888] mb-2">
                          Company / Node Name
                        </label>
                        <input
                          type="text"
                          value={job.company}
                          required
                          onChange={(e) => handleUpdateWorkHistory(idx, { company: e.target.value })}
                          className="w-full px-3 py-2 bg-black border border-white/10 focus:border-white outline-none text-white font-mono text-xs transition-colors"
                          placeholder="e.g. CoreSystems Co."
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-widest text-[#888888] mb-2">
                          Duration Timeline
                        </label>
                        <input
                          type="text"
                          value={job.duration}
                          required
                          onChange={(e) => handleUpdateWorkHistory(idx, { duration: e.target.value })}
                          className="w-full px-3 py-2 bg-black border border-white/10 focus:border-white outline-none text-white font-mono text-xs transition-colors"
                          placeholder="e.g. 2025 - Present"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: TESTIMONIALS ================= */}
        {activeTab === 'testimonials' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-mono text-sm uppercase tracking-widest text-white">/ Testimonial & Reputation deck</h3>
                <p className="text-[10px] font-mono text-[#888888] mt-1">
                  Adjust reviews displayed inside the "What Clients Say" section on the landing page
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddTestimonial}
                className="flex items-center space-x-2 px-4 py-2 border border-white/20 hover:border-white bg-white/5 hover:bg-white text-white hover:text-black font-mono text-[10px] uppercase tracking-widest transition-all duration-300"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Testimonial Quote</span>
              </button>
            </div>

            {profile.testimonials.length === 0 ? (
              <div className="border border-dashed border-white/10 p-12 text-center text-slate-500 font-mono text-xs uppercase tracking-wider">
                No custom testimonials recorded. Currently falling back to standard community review slides.
              </div>
            ) : (
              <div className="space-y-6">
                {profile.testimonials.map((test, idx) => (
                  <div key={idx} className="border border-white/10 bg-[#060606] p-6 relative space-y-4">
                    <div className="absolute top-4 right-4 flex items-center space-x-4">
                      <span className="font-mono text-xs text-[#888888]">Quote Row #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteTestimonial(idx)}
                        className="p-1.5 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all rounded-md"
                        title="Delete Quote Card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pt-4">
                      <label className="block font-mono text-[9px] uppercase tracking-widest text-[#888888] mb-2">
                        Client Quote / Feedback
                      </label>
                      <textarea
                        rows={3}
                        value={test.quote}
                        required
                        onChange={(e) => handleUpdateTestimonial(idx, { quote: e.target.value })}
                        className="w-full px-3 py-2 bg-black border border-white/10 focus:border-white outline-none text-white font-mono text-xs transition-colors"
                        placeholder="Write dynamic client quote testimonial reviews here..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-widest text-[#888888] mb-2">
                          Client Full Name
                        </label>
                        <input
                          type="text"
                          value={test.client}
                          required
                          onChange={(e) => handleUpdateTestimonial(idx, { client: e.target.value })}
                          className="w-full px-3 py-2 bg-black border border-white/10 focus:border-white outline-none text-white font-mono text-xs uppercase tracking-widest transition-colors"
                          placeholder="e.g. Sarah Jenkins"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-widest text-[#888888] mb-2">
                          Client Title / Role
                        </label>
                        <input
                          type="text"
                          value={test.title}
                          required
                          onChange={(e) => handleUpdateTestimonial(idx, { title: e.target.value })}
                          className="w-full px-3 py-2 bg-black border border-white/10 focus:border-white outline-none text-white font-mono text-xs transition-colors"
                          placeholder="e.g. Lead Architect at CoreSystems"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-widest text-[#888888] mb-2">
                          Timeline / Date
                        </label>
                        <input
                          type="text"
                          value={test.date}
                          required
                          onChange={(e) => handleUpdateTestimonial(idx, { date: e.target.value })}
                          className="w-full px-3 py-2 bg-black border border-white/10 focus:border-white outline-none text-white font-mono text-xs transition-colors"
                          placeholder="e.g. Dec 2025"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= SHARED FORM FOOTER ACTIONS ================= */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs uppercase tracking-widest bg-black">
          <div className="w-full sm:w-auto">
            {error && (
              <div className="flex items-center space-x-2 text-red-500">
                <AlertTriangle className="w-4 h-4" />
                <span>Error: {error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center space-x-2 text-green-500">
                <span>[SUCCESS] Profile databases synced globally.</span>
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto ml-auto flex items-center justify-center space-x-3 px-8 py-4 bg-white hover:bg-black text-black hover:text-white border border-white text-xs font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Syncing Nodes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
