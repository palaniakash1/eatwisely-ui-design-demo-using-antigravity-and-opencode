import { useState } from "react";
import { useSelector } from "react-redux";
import { Card, TextInput, Button, Label } from "flowbite-react";
import {
  DashboardHeader,
  DashboardContent,
  DashboardLayout,
} from "../components/DashboardLayout";

const ToggleSwitch = ({ checked, onChange, id }) => (
  <label
    htmlFor={id}
    className="relative inline-flex items-center cursor-pointer"
  >
    <input
      type="checkbox"
      id={id}
      className="sr-only peer"
      checked={checked}
      onChange={onChange}
    />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#8fa31e]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8fa31e]"></div>
  </label>
);

export default function DashSettings() {
  const { currentUser } = useSelector((state) => state.user);

  const [settings, setSettings] = useState({
    siteName: "EatWisely",
    siteEmail: "support@eatwisely.com",
    contactPhone: "+44 20 7946 0000",
    address: "123 Main Street, London, UK",
    allowRegistration: true,
    requireEmailVerification: false,
    defaultUserRole: "user",
    maxRestaurantsPerUser: 5,
    maintenanceMode: false,
  });

  const handleSaveSettings = () => {
    localStorage.setItem("siteSettings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  };

  return (
    <>
      <DashboardContent>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            General Settings
          </h2>

          <div className="grid gap-4 sm:gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Site Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName" value="Site Name" />
                  <TextInput
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) =>
                      setSettings({ ...settings, siteName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="siteEmail" value="Support Email" />
                  <TextInput
                    id="siteEmail"
                    type="email"
                    value={settings.siteEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, siteEmail: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone" value="Contact Phone" />
                  <TextInput
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) =>
                      setSettings({ ...settings, contactPhone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="address" value="Address" />
                  <TextInput
                    id="address"
                    value={settings.address}
                    onChange={(e) =>
                      setSettings({ ...settings, address: e.target.value })
                    }
                  />
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">User Management</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="allowRegistration"
                      value="Allow User Registration"
                    />
                    <p className="text-sm text-gray-500">
                      Allow new users to register on the platform
                    </p>
                  </div>
                  <ToggleSwitch
                    id="allowRegistration"
                    checked={settings.allowRegistration}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        allowRegistration: e.target.checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="requireEmailVerification"
                      value="Require Email Verification"
                    />
                    <p className="text-sm text-gray-500">
                      Users must verify their email before logging in
                    </p>
                  </div>
                  <ToggleSwitch
                    id="requireEmailVerification"
                    checked={settings.requireEmailVerification}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        requireEmailVerification: e.target.checked,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="defaultRole" value="Default User Role" />
                  <select
                    id="defaultRole"
                    value={settings.defaultUserRole}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        defaultUserRole: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8fa31e] focus:ring-[#8fa31e] sm:text-sm p-2 border"
                  >
                    <option value="user">User</option>
                    <option value="storeManager">Store Manager</option>
                  </select>
                </div>
                <div>
                  <Label
                    htmlFor="maxRestaurants"
                    value="Max Restaurants Per User"
                  />
                  <TextInput
                    id="maxRestaurants"
                    type="number"
                    value={settings.maxRestaurantsPerUser}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maxRestaurantsPerUser: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">System</h3>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode" value="Maintenance Mode" />
                  <p className="text-sm text-gray-500">
                    Show maintenance page to all users
                  </p>
                </div>
                <ToggleSwitch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maintenanceMode: e.target.checked,
                    })
                  }
                />
              </div>
            </Card>

            <div className="flex justify-end">
              <Button className="bg-[#8fa31e]" onClick={handleSaveSettings}>
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </DashboardContent>
    </>
  );
}
