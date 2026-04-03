import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  HiUsers,
  HiHome,
  HiViewGrid,
  HiChartBar,
  HiLogin,
  HiUserAdd,
  HiEye,
  HiShoppingBag,
  HiCurrencyPound,
  HiRefresh,
  HiTrendingUp,
  HiTrendingDown,
  HiLocationMarker
} from 'react-icons/hi';
import { FaStore, FaList, FaUtensils } from 'react-icons/fa';
import { Spinner } from 'flowbite-react';
import dashboardApi from '../../services/dashboardApi';

const COLORS = ['#8fa31e', '#6b8a16', '#4a6310', '#8fa31e33'];

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = '#8fa31e' }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value?.toLocaleString() || 0}</p>
      </div>
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-7 h-7" style={{ color }} />
      </div>
    </div>
    {trendValue !== undefined && (
      <div className="mt-4 flex items-center gap-2">
        {trend === 'up' ? (
          <HiTrendingUp className="w-4 h-4 text-green-600" />
        ) : (
          <HiTrendingDown className="w-4 h-4 text-red-500" />
        )}
        <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
          {Math.abs(trendValue)}%
        </span>
        <span className="text-xs text-gray-500">from last period</span>
      </div>
    )}
  </div>
);

const RealtimeCard = ({ label, value, icon: Icon, color = '#8fa31e' }) => (
  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center"
      style={{ backgroundColor: `${color}15` }}
    >
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value?.toLocaleString() || 0}</p>
    </div>
    <div className="ml-auto">
      <span className="flex items-center gap-1 text-xs text-green-600">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        Live
      </span>
    </div>
  </div>
);

const ActivityItem = ({ activity }) => {
  const getActionColor = (action) => {
    const colors = {
      CREATE: 'bg-green-100 text-green-700',
      UPDATE: 'bg-blue-100 text-blue-700',
      DELETE: 'bg-red-100 text-red-700',
      LOGIN: 'bg-purple-100 text-purple-700',
      LOGOUT: 'bg-gray-100 text-gray-700',
      STATUS_CHANGE: 'bg-yellow-100 text-yellow-700'
    };
    return colors[action] || 'bg-gray-100 text-gray-700';
  };

  const getEntityIcon = (entityType) => {
    const icons = {
      user: HiUsers,
      restaurant: FaStore,
      menu: FaUtensils,
      category: HiViewGrid,
      auth: HiLogin,
      review: HiChartBar
    };
    const Icon = icons[entityType] || HiChartBar;
    return <Icon className="w-4 h-4" />;
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="w-8 h-8 rounded-full bg-[#8fa31e]/10 flex items-center justify-center text-[#8fa31e]">
        {getEntityIcon(activity.entityType)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">
          <span className="font-medium">
            {activity.actorId?.userName || 'System'}
          </span>
          <span className="text-gray-500"> </span>
          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getActionColor(activity.action)}`}>
            {activity.action}
          </span>
          <span className="text-gray-500"> </span>
          <span className="capitalize">{activity.entityType}</span>
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{formatTime(activity.createdAt)}</p>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardOverview({ role = 'superAdmin' }) {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [realtimeData, setRealtimeData] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [overviewRes, realtimeRes] = await Promise.all([
        dashboardApi.getOverview(),
        dashboardApi.getRealtime()
      ]);
      
      if (overviewRes.success) {
        setData(overviewRes.data);
      }
      if (realtimeRes.success) {
        setRealtimeData(realtimeRes.data);
      }
      setError(null);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      dashboardApi.getRealtime()
        .then((res) => {
          if (res.success) setRealtimeData(res.data);
        })
        .catch(console.error);
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="xl" color="success" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium">Failed to load dashboard</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { overview, userAnalytics, contentAnalytics, rolesDistribution, recentActivity } = data || {};
  const { realtime } = data || {};

  const pieData = rolesDistribution?.map((r) => ({
    name: r._id.charAt(0).toUpperCase() + r._id.slice(1),
    value: r.count
  })) || [];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const isAdmin = role === 'superAdmin' || role === 'admin';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back, {currentUser?.userName}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </span>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <HiRefresh className={`w-5 h-5 text-gray-600 ${autoRefresh ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-[#8fa31e] text-white rounded-lg hover:bg-[#7a8c1a] transition-colors text-sm font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Real-time At Glance */}
      {realtimeData && (
        <div className="bg-gradient-to-r from-[#8fa31e]/5 to-[#6b8a16]/5 rounded-xl p-6 border border-[#8fa31e]/20">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <h2 className="text-lg font-semibold text-gray-900">Real-time At Glance</h2>
            <span className="text-xs text-gray-500">(Updates every 30s)</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <RealtimeCard
              label="Active Now"
              value={realtimeData.activeNow}
              icon={HiEye}
              color="#8fa31e"
            />
            <RealtimeCard
              label="New Users Today"
              value={realtimeData.today.newUsers}
              icon={HiUserAdd}
              color="#6b8a16"
            />
            <RealtimeCard
              label="Logins Today"
              value={realtimeData.today.logins}
              icon={HiLogin}
              color="#4a6310"
            />
            <RealtimeCard
              label="New Restaurants"
              value={realtimeData.today.newRestaurants}
              icon={FaStore}
              color="#8fa31e"
            />
            <RealtimeCard
              label="New Menus"
              value={realtimeData.today.newMenus}
              icon={FaUtensils}
              color="#6b8a16"
            />
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {isAdmin && overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value={overview.users.total}
            icon={HiUsers}
            trend="up"
            trendValue={overview.users.newThisWeek > 0 ? Math.round((overview.users.newThisWeek / overview.users.total) * 100) || 0 : 0}
            color="#8fa31e"
          />
          <StatsCard
            title="Restaurants"
            value={overview.restaurants.total}
            icon={FaStore}
            trend="up"
            trendValue={overview.restaurants.newThisWeek > 0 ? Math.round((overview.restaurants.newThisWeek / overview.restaurants.total) * 100) || 0 : 0}
            color="#6b8a16"
          />
          <StatsCard
            title="Categories"
            value={overview.categories.total}
            icon={HiViewGrid}
            trend="up"
            trendValue={overview.categories.newThisWeek > 0 ? Math.round((overview.categories.newThisWeek / overview.categories.total) * 100) || 0 : 0}
            color="#4a6310"
          />
          <StatsCard
            title="Menu Items"
            value={overview.menus.totalItems}
            icon={FaUtensils}
            trend="up"
            trendValue={overview.menus.newThisWeek > 0 ? Math.round((overview.menus.newThisWeek / overview.menus.total) * 100) || 0 : 0}
            color="#8fa31e"
          />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Activity (Last 7 Days)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userAnalytics || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tickFormatter={formatDate} stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="signups"
                  name="Signups"
                  stroke="#8fa31e"
                  strokeWidth={2}
                  dot={{ fill: '#8fa31e', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="logins"
                  name="Logins"
                  stroke="#6b8a16"
                  strokeWidth={2}
                  dot={{ fill: '#6b8a16', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  name="Visitors"
                  stroke="#4a6310"
                  strokeWidth={2}
                  dot={{ fill: '#4a6310', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Roles Distribution */}
        {isAdmin && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">User Roles Distribution</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {rolesDistribution?.map((r, i) => (
                <div key={r._id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    ></span>
                    <span className="text-gray-700 capitalize">{r._id}</span>
                  </div>
                  <span className="font-medium text-gray-900">{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content Analytics Chart */}
      {isAdmin && contentAnalytics && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Creation (Last 7 Days)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentAnalytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tickFormatter={formatDate} stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="restaurants" name="Restaurants" fill="#8fa31e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="menus" name="Menus" fill="#6b8a16" radius={[4, 4, 0, 0]} />
                <Bar dataKey="categories" name="Categories" fill="#4a6310" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <span className="text-xs text-gray-500">{recentActivity?.length || 0} recent</span>
          </div>
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.slice(0, 10).map((activity, index) => (
                <ActivityItem key={activity._id || index} activity={activity} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No recent activity</p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        {isAdmin && overview && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <HiUsers className="w-5 h-5 text-[#8fa31e]" />
                  <span className="text-sm text-gray-700">Active Users</span>
                </div>
                <span className="font-semibold text-gray-900">{overview.users.active}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaStore className="w-5 h-5 text-[#6b8a16]" />
                  <span className="text-sm text-gray-700">Published Restaurants</span>
                </div>
                <span className="font-semibold text-gray-900">{overview.restaurants.published}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <HiViewGrid className="w-5 h-5 text-[#4a6310]" />
                  <span className="text-sm text-gray-700">Active Categories</span>
                </div>
                <span className="font-semibold text-gray-900">{overview.categories.active}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaUtensils className="w-5 h-5 text-[#8fa31e]" />
                  <span className="text-sm text-gray-700">Published Menus</span>
                </div>
                <span className="font-semibold text-gray-900">{overview.menus.published}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <HiChartBar className="w-5 h-5 text-[#6b8a16]" />
                  <span className="text-sm text-gray-700">Total Reviews</span>
                </div>
                <span className="font-semibold text-gray-900">{overview.reviews.total}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <HiChartBar className="w-5 h-5 text-[#4a6310]" />
                  <span className="text-sm text-gray-700">Audit Logs</span>
                </div>
                <span className="font-semibold text-gray-900">{overview.auditLogs.total}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
