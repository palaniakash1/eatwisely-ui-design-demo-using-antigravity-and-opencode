import { useState } from 'react';
import { Button, Alert } from 'flowbite-react';
import { useToast } from '../components/Toast';
import { useSystemMode } from '../context/SystemModeContext';
import {
  HiCog,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiShieldCheck,
  HiUserGroup,
  HiSave
} from 'react-icons/hi';
import { HiCog6Tooth } from 'react-icons/hi2';

function ToggleSwitch({ checked, onChange, id }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        id={id}
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="h-7 w-12 rounded-full bg-slate-300 transition peer-checked:bg-[#8fa31e] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#d8e89d] after:absolute after:left-[4px] after:top-[4px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-5" />
    </label>
  );
}

const defaultSettings = {
  siteName: 'EatWisely',
  siteEmail: 'support@eatwisely.com',
  contactPhone: '+44 20 7946 0000',
  address: '123 Main Street, London, UK',
  allowRegistration: true,
  requireEmailVerification: false,
  defaultUserRole: 'user',
  maxRestaurantsPerUser: 5
};

const getInitialSettings = () => {
  try {
    const stored = localStorage.getItem('siteSettings');
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultSettings, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return defaultSettings;
};

export default function DashSettings() {
  const toast = useToast();
  const {
    isMaintenanceMode,
    isUnderDevelopment,
    setMaintenanceMode,
    setUnderDevelopment
  } = useSystemMode();

  const [settings, setSettings] = useState(getInitialSettings);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleSaveSettings = async () => {
    setLoading(true);
    setSuccess(null);

    await new Promise((resolve) => setTimeout(resolve, 500));

    localStorage.setItem('siteSettings', JSON.stringify(settings));
    setSuccess('Settings saved successfully!');
    toast.success('Settings saved successfully!');
    setLoading(false);
  };

  const handleMaintenanceModeToggle = (checked) => {
    setMaintenanceMode(checked);
    if (checked) {
      toast.warning(
        'Maintenance mode enabled! Users will see the maintenance page.'
      );
    } else {
      toast.success('Maintenance mode disabled!');
    }
  };

  const handleUnderDevelopmentToggle = (checked) => {
    setUnderDevelopment(checked);
    if (checked) {
      toast.warning(
        'Under development mode enabled! Users will see the development page.'
      );
    } else {
      toast.success('Under development mode disabled!');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#f7f9e8] via-[#fafcf3] to-[#f4f7e8]">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-[1600px] mx-auto">
          {success && (
            <Alert
              color="success"
              onDismiss={() => setSuccess(null)}
              className="mb-6"
            >
              {success}
            </Alert>
          )}

          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-[#6b7d18] via-[#8fa31e] to-[#a5b82e] px-6 sm:px-8 py-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-lg">
                    <HiCog className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Settings</h1>
                    <p className="text-green-100 text-sm">
                      Configure platform settings and preferences
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-5 border-b border-gray-100 bg-gray-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-3.5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#8fa31e] to-[#a5b82e] rounded-xl flex items-center justify-center text-white shadow-lg">
                    <HiCog className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">
                      Platform
                    </div>
                    <div className="text-sm font-bold text-gray-800">
                      {settings.siteName}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <HiShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">
                      Security
                    </div>
                    <div className="text-sm font-bold text-emerald-600">
                      {settings.requireEmailVerification
                        ? 'Email Verified'
                        : 'Standard'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <HiUserGroup className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">
                      Registration
                    </div>
                    <div className="text-sm font-bold text-gray-800">
                      {settings.allowRegistration ? 'Open' : 'Closed'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${isMaintenanceMode ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}
                  >
                    <HiCog6Tooth
                      className={`w-5 h-5 ${isMaintenanceMode ? 'animate-spin' : ''}`}
                    />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">
                      System Status
                    </div>
                    <div className="text-sm font-bold text-gray-800">
                      {isMaintenanceMode || isUnderDevelopment
                        ? 'Restricted'
                        : 'Normal'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden mb-6">
            <div className="px-6 sm:px-8 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <HiLocationMarker className="w-5 h-5 text-[#8fa31e]" />
                Site Information
              </h2>
            </div>
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <HiCog className="w-4 h-4 text-[#8fa31e]" />
                    Site Name
                  </label>
                  <input
                    type="text"
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) =>
                      setSettings({ ...settings, siteName: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl bg-[#f7f9e8]/50 focus:bg-white focus:border-[#8fa31e] focus:ring-2 focus:ring-[#d8e89d]/50 transition-all outline-none text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <HiMail className="w-4 h-4 text-[#8fa31e]" />
                    Support Email
                  </label>
                  <input
                    type="email"
                    id="siteEmail"
                    value={settings.siteEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, siteEmail: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl bg-[#f7f9e8]/50 focus:bg-white focus:border-[#8fa31e] focus:ring-2 focus:ring-[#d8e89d]/50 transition-all outline-none text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <HiPhone className="w-4 h-4 text-[#8fa31e]" />
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) =>
                      setSettings({ ...settings, contactPhone: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl bg-[#f7f9e8]/50 focus:bg-white focus:border-[#8fa31e] focus:ring-2 focus:ring-[#d8e89d]/50 transition-all outline-none text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <HiLocationMarker className="w-4 h-4 text-[#8fa31e]" />
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={settings.address}
                    onChange={(e) =>
                      setSettings({ ...settings, address: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl bg-[#f7f9e8]/50 focus:bg-white focus:border-[#8fa31e] focus:ring-2 focus:ring-[#d8e89d]/50 transition-all outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden mb-6">
            <div className="px-6 sm:px-8 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <HiUserGroup className="w-5 h-5 text-[#8fa31e]" />
                User Management
              </h2>
            </div>
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between p-5 bg-gradient-to-br from-[#f7f9e8] to-[#f0f4d8] rounded-xl border border-[#d4de8a]/30">
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    Allow User Registration
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Allow new users to register on the platform
                  </p>
                </div>
                <ToggleSwitch
                  id="allowRegistration"
                  checked={settings.allowRegistration}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      allowRegistration: e.target.checked
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-5 bg-gradient-to-br from-[#f7f9e8] to-[#f0f4d8] rounded-xl border border-[#d4de8a]/30">
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    Require Email Verification
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Users must verify their email before logging in
                  </p>
                </div>
                <ToggleSwitch
                  id="requireEmailVerification"
                  checked={settings.requireEmailVerification}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      requireEmailVerification: e.target.checked
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Default User Role
                  </label>
                  <select
                    id="defaultRole"
                    value={settings.defaultUserRole}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        defaultUserRole: e.target.value
                      })
                    }
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl bg-[#f7f9e8]/50 focus:bg-white focus:border-[#8fa31e] focus:ring-2 focus:ring-[#d8e89d]/50 transition-all outline-none text-sm"
                  >
                    <option value="user">User</option>
                    <option value="storeManager">Store Manager</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Max Restaurants Per User
                  </label>
                  <input
                    type="number"
                    id="maxRestaurants"
                    value={settings.maxRestaurantsPerUser}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maxRestaurantsPerUser: parseInt(e.target.value)
                      })
                    }
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl bg-[#f7f9e8]/50 focus:bg-white focus:border-[#8fa31e] focus:ring-2 focus:ring-[#d8e89d]/50 transition-all outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden mb-6">
            <div className="px-6 sm:px-8 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <HiShieldCheck className="w-5 h-5 text-[#8fa31e]" />
                System Status
              </h2>
            </div>
            <div className="p-6 sm:p-8 space-y-4">
              <div
                className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all ${isMaintenanceMode ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300' : 'bg-gradient-to-br from-[#f7f9e8] to-[#f0f4d8] border-[#d4de8a]/30'}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${isMaintenanceMode ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}
                  >
                    <HiCog6Tooth
                      className={`w-6 h-6 text-white ${isMaintenanceMode ? 'animate-spin' : ''}`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      Maintenance Mode
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      When enabled, all users (except superAdmin) will see the
                      maintenance page instead of regular content.
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  id="maintenanceMode"
                  checked={isMaintenanceMode}
                  onChange={(e) =>
                    handleMaintenanceModeToggle(e.target.checked)
                  }
                />
              </div>

              <div
                className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all ${isUnderDevelopment ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-300' : 'bg-gradient-to-br from-[#f7f9e8] to-[#f0f4d8] border-[#d4de8a]/30'}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${isUnderDevelopment ? 'bg-gradient-to-br from-purple-500 to-indigo-500' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}
                  >
                    <svg
                      className={`w-6 h-6 text-white ${isUnderDevelopment ? 'animate-pulse' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      Under Development
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      When enabled, all users (except superAdmin) will see the
                      "Coming Soon" page instead of regular content.
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  id="underDevelopment"
                  checked={isUnderDevelopment}
                  onChange={(e) =>
                    handleUnderDevelopmentToggle(e.target.checked)
                  }
                />
              </div>

              {(isMaintenanceMode || isUnderDevelopment) && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-800">
                        Exempt Users
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        SuperAdmin users are always exempt from both modes and
                        can access all pages normally.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveSettings}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-[#6b7d18] to-[#8fa31e] hover:from-[#4a5c10] hover:to-[#6b7d18] shadow-lg shadow-[#8fa31e]/25 transition-all font-semibold rounded-xl"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <HiSave className="w-5 h-5" />
                  Save Settings
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
