"use client";

import React, { useState, useEffect } from 'react';
import Background from '@/components/layout/Background';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import Toggle from '@/components/ui/Toggle';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import { User, Bell, Trash2, Globe } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { settings, updateSettings } = useSettings();

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'ja', label: '日本語' },
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'New York (Eastern)' },
    { value: 'America/Chicago', label: 'Chicago (Central)' },
    { value: 'Asia/Phnom_Penh', label: 'Phnom Penh (Indochina Time, UTC+7)' },
    { value: 'America/Denver', label: 'Denver (Mountain)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (Pacific)' },
    { value: 'America/Toronto', label: 'Toronto' },
    { value: 'America/Vancouver', label: 'Vancouver' },
    { value: 'America/Mexico_City', label: 'Mexico City' },
    { value: 'America/Sao_Paulo', label: 'São Paulo' },
    { value: 'Europe/London', label: 'London (UK)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Europe/Berlin', label: 'Berlin (CET)' },
    { value: 'Europe/Rome', label: 'Rome (CET)' },
    { value: 'Europe/Madrid', label: 'Madrid (CET)' },
    { value: 'Europe/Amsterdam', label: 'Amsterdam (CET)' },
    { value: 'Europe/Warsaw', label: 'Warsaw (CET)' },
    { value: 'Europe/Moscow', label: 'Moscow (MSK)' },
    { value: 'Asia/Dubai', label: 'Dubai (GST)' },
    { value: 'Asia/Kolkata', label: 'India (IST)' },
    { value: 'Asia/Mumbai', label: 'Mumbai (IST)' },
    { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Seoul', label: 'Seoul (KST)' },
    { value: 'Asia/Bangkok', label: 'Bangkok (ICT)' },
    { value: 'Asia/Jakarta', label: 'Jakarta (WIB)' },
    { value: 'Asia/Manila', label: 'Manila (PHT)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
    { value: 'Australia/Melbourne', label: 'Melbourne (AEST)' },
    { value: 'Australia/Perth', label: 'Perth (AWST)' },
    { value: 'Pacific/Auckland', label: 'Auckland (NZST)' },
    { value: 'Pacific/Honolulu', label: 'Honolulu (HST)' },
  ];

  const handleAutoDetectTimezone = () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezones.find(t => t.value === tz)) {
      updateSettings('timezone', tz);
    } else {
      updateSettings('timezone', 'UTC');
    }
  };

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const date = new Date();
        const timeString = date.toLocaleTimeString('en-US', {
          timeZone: settings.timezone,
          hour: settings.timeFormat === '24h' ? '2-digit' : 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: settings.timeFormat !== '24h',
        });
        setCurrentTime(timeString);
      } catch {
        setCurrentTime('--:--:--');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.timezone, settings.timeFormat]);


  const handleSaveProfile = () => {
    console.log('Saving profile:', editForm);
    setShowEditProfile(false);
  };

  const handleChangePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert('Passwords do not match');
      return;
    }
    console.log('Changing password');
    setShowChangePassword(false);
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText.toLowerCase() === 'delete') {
      console.log('Deleting account');
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
      alert('Account deleted (local data cleared)');
    }
  };

  return (
    <>
      <Background />
      <div className="min-h-screen pt-32 px-6 md:px-12 pb-12 relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl font-black tracking-[0.2em] uppercase text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-400 mb-12">Manage your account preferences and settings</p>

        {/* ACCOUNT SECTION */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-red-600" size={24} />
            <h2 className="text-xl font-bold text-white tracking-wider">ACCOUNT</h2>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-800">
              <div>
                <h3 className="text-white font-medium">Edit Profile</h3>
                <p className="text-gray-500 text-sm">Update your name and email</p>
              </div>
              <button
                onClick={() => setShowEditProfile(true)}
                className="mt-3 md:mt-0 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
              >
                Edit
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-800">
              <div>
                <h3 className="text-white font-medium">Change Password</h3>
                <p className="text-gray-500 text-sm">Update your account password</p>
              </div>
              <button
                onClick={() => setShowChangePassword(true)}
                className="mt-3 md:mt-0 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
              >
                Change
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between py-3">
              <div>
                <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                <p className="text-gray-500 text-sm">Add an extra layer of security</p>
              </div>
              <div className="mt-3 md:mt-0 flex items-center gap-3">
                <span className="text-yellow-500 text-xs bg-yellow-500/10 px-2 py-1 rounded">Coming Soon</span>
              </div>
            </div>
          </div>
        </section>

        {/* PREFERENCES SECTION */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="text-red-600" size={24} />
            <h2 className="text-xl font-bold text-white tracking-wider">PREFERENCES</h2>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Current Time</p>
              <p className="text-3xl font-mono text-white">{currentTime}</p>
              <p className="text-gray-500 text-xs mt-1">{settings.timezone}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Select
                label="Language"
                value={settings.language}
                onChange={(value) => updateSettings('language', value)}
                options={languages}
              />
              <div>
                <Select
                  label="Timezone"
                  value={settings.timezone}
                  onChange={(value) => updateSettings('timezone', value)}
                  options={timezones}
                />
                <button
                  onClick={handleAutoDetectTimezone}
                  className="text-xs text-red-500 hover:text-red-400 mt-1 transition-colors"
                >
                  Auto-detect
                </button>
              </div>
            </div>

            <div className="mt-4">
              <Toggle
                label="Time Format (24h)"
                checked={settings.timeFormat === '24h'}
                onChange={(value) => updateSettings('timeFormat', value ? '24h' : '12h')}
              />
            </div>
          </div>
        </section>

        {/* NOTIFICATIONS SECTION */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="text-red-600" size={24} />
            <h2 className="text-xl font-bold text-white tracking-wider">NOTIFICATIONS</h2>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <Toggle
              label="Booking Confirmations"
              checked={settings.emailBookings}
              onChange={(value) => updateSettings('emailBookings', value)}
            />
            <Toggle
              label="Promotional Emails"
              checked={settings.emailPromotions}
              onChange={(value) => updateSettings('emailPromotions', value)}
            />
            <Toggle
              label="Push Notifications"
              checked={settings.pushNotifications}
              onChange={(value) => updateSettings('pushNotifications', value)}
            />
          </div>
        </section>

        {/* DANGER ZONE */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Trash2 className="text-red-600" size={24} />
            <h2 className="text-xl font-bold text-white tracking-wider">DANGER ZONE</h2>
          </div>
          
          <div className="bg-red-900/10 border border-red-900/30 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Delete Account</h3>
                <p className="text-gray-500 text-sm">Permanently delete your account and all data</p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="mt-3 md:mt-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
              >
                Delete Account
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* EDIT PROFILE MODAL */}
      <Modal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowEditProfile(false)}
              className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* CHANGE PASSWORD MODAL */}
      <Modal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        title="Change Password"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Current Password</label>
            <input
              type="password"
              value={passwordForm.current}
              onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">New Password</label>
            <input
              type="password"
              value={passwordForm.new}
              onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowChangePassword(false)}
              className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleChangePassword}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Change
            </button>
          </div>
        </div>
      </Modal>

      {/* DELETE ACCOUNT MODAL */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteConfirmText('');
        }}
        title="Delete Account"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            This action is permanent and cannot be undone. All your bookings and account data will be permanently deleted.
          </p>
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Type <span className="text-red-500 font-bold">delete</span> to confirm
            </label>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="delete"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setShowDeleteConfirm(false);
                setDeleteConfirmText('');
              }}
              className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText.toLowerCase() !== 'delete'}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SettingsPage;
