import { useState, useEffect, FormEvent } from 'react';
import { Save, Loader } from 'lucide-react';
import { api } from '../../../lib/api';

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
    github_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      if (response.data) {
        setProfile(response.data);
      }
      // Profile is already initialized with empty values
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Profile remains with empty values
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    setSaving(true);
    setSuccess(false);

    try {
      console.log('Sending profile data:', profile);
      const response = await api.put('/profile', profile);
      console.log('Profile save response:', response.data);
      setProfile(response.data); // Update with the saved profile (which will have _id)
      setSuccess(true);
    } catch (error: unknown) {
      console.error('Error saving profile:', error);
      const err = error as { response?: { data?: { error?: string } } };
      setError(err.response?.data?.error || 'Failed to save profile');
      console.error('Error response:', err.response?.data);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-gray-400">Update your portfolio profile information</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Headline</label>
            <input
              type="text"
              value={profile.headline}
              onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-white"
              placeholder="Software Engineer | Full-Stack Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">About Me</label>
            <textarea
              rows={6}
              value={profile.about_me}
              onChange={(e) => setProfile({ ...profile, about_me: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-white resize-none"
              placeholder="Tell visitors about yourself..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <input
                type="text"
                value={profile.location || ''}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-white"
                placeholder="City, Country"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Profile Image URL
            </label>
            <input
              type="url"
              value={profile.profile_image_url || ''}
              onChange={(e) => setProfile({ ...profile, profile_image_url: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Resume URL</label>
            <input
              type="url"
              value={profile.resume_url || ''}
              onChange={(e) => setProfile({ ...profile, resume_url: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-white"
              placeholder="https://example.com/resume.pdf"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={profile.linkedin_url || ''}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-white"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
              <input
                type="url"
                value={profile.github_url || ''}
                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-white"
                placeholder="https://github.com/username"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">Profile updated successfully!</p>}
          <button
            type="submit"
            disabled={saving}
            className="ml-auto flex items-center space-x-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 rounded-lg transition-colors"
          >
            {saving ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
