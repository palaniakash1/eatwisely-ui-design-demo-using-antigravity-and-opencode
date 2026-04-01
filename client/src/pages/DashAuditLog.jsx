import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { Spinner, TextInput, Select } from "flowbite-react";
import { FaSearch, FaSync, FaClock, FaDesktop, FaCircle, FaFilter } from "react-icons/fa";
import FloatingPagination from "../components/FloatingPagination";
import { fetchAuditLogs, mapAuditLogToDisplay } from "../services/auditApi";

const ACTION_CONFIG = {
  LOGIN: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", icon: "→", label: "Login" },
  LOGOUT: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200", icon: "←", label: "Logout" },
  LOGIN_FAILED: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", icon: "!", label: "Failed Login" },
  CREATE: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", icon: "+", label: "Created" },
  UPDATE: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", icon: "✎", label: "Updated" },
  DELETE: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", icon: "✕", label: "Deleted" },
  STATUS_CHANGE: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", icon: "◐", label: "Status Change" },
  BULK_UPDATE: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", icon: "⚙", label: "Bulk Update" },
  RESTORE: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200", icon: "↺", label: "Restored" },
  REASSIGN: { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200", icon: "⇄", label: "Reassigned" },
  REFRESH: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", icon: "↻", label: "Refresh" },
};

export default function DashAuditLog() {
  const { currentUser } = useSelector((state) => state.user);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [actionFilter, setActionFilter] = useState("");
  const [refreshInterval, setRefreshInterval] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const intervalRef = useRef(null);
  const contentRef = useRef(null);

  const loadAuditLogs = useCallback(async (showLoader = true, page = currentPage) => {
    if (showLoader) setLoading(true);
    setIsRefreshing(true);
    try {
      setError(null);
      const response = await fetchAuditLogs({
        page: page,
        limit: itemsPerPage,
        action: actionFilter || undefined,
      });
      
      const mappedLogs = (response.data || []).map(mapAuditLogToDisplay);
      setAuditLogs(mappedLogs);
      setTotalItems(response.total || 0);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
      setError(err.message || 'Failed to load audit logs');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [currentPage, actionFilter, itemsPerPage]);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(() => loadAuditLogs(false, currentPage), refreshInterval);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refreshInterval]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadAuditLogs(true, newPage);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    loadAuditLogs(true, 1);
  };

  const handleActionFilterChange = (value) => {
    setActionFilter(value);
    setCurrentPage(1);
    loadAuditLogs(true, 1);
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      log.action?.toLowerCase().includes(term) ||
      log.user?.toLowerCase().includes(term) ||
      log.details?.toLowerCase().includes(term)
    );
  });

  const getRelativeTime = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const stats = {
    total: totalItems,
    logins: auditLogs.filter(l => l.action === 'LOGIN').length,
    creates: auditLogs.filter(l => l.action === 'CREATE').length,
    updates: auditLogs.filter(l => l.action === 'UPDATE').length,
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#f7f9e8] via-[#fafcf3] to-[#f4f7e8]">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-[1600px] mx-auto">
          
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-[#6b7d18] via-[#8fa31e] to-[#a5b82e] px-6 sm:px-8 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg shadow-black/10">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Audit Trail</h1>
                    <p className="text-green-100 text-sm">System activity and security monitoring</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur rounded-xl border border-white/20">
                    <FaCircle className={`w-2.5 h-2.5 ${isRefreshing ? 'text-yellow-300 animate-pulse' : 'text-white'}`} />
                    <span className="text-white/90 text-sm font-medium">
                      {isRefreshing ? 'Updating...' : lastUpdated ? `Updated ${getRelativeTime(lastUpdated)}` : 'Ready'}
                    </span>
                  </div>
                  <button
                    onClick={() => loadAuditLogs(false, currentPage)}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-white/95 text-[#6b7d18] rounded-xl transition-all font-semibold shadow-lg shadow-white/25 disabled:opacity-60"
                  >
                    <FaSync className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="px-6 sm:px-8 py-5 border-b border-gray-100 bg-gray-50/50">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Events', value: totalItems, icon: '📋', gradient: 'from-[#8fa31e] to-[#a5b82e]' },
                  { label: 'Logins', value: stats.logins, icon: '🔐', gradient: 'from-blue-500 to-blue-600' },
                  { label: 'Creations', value: stats.creates, icon: '✨', gradient: 'from-emerald-500 to-emerald-600' },
                  { label: 'Updates', value: stats.updates, icon: '📝', gradient: 'from-amber-500 to-amber-600' },
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-3.5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-11 h-11 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center text-xl shadow-lg`}>
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                      <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="px-6 sm:px-8 py-5">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8fa31e]" />
                  <TextInput
                    type="text"
                    placeholder="Search by action, user, or details..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-11 [&_input]:!bg-[#f7f9e8] [&_input]:!border-[#d4de8a] focus:[&_input]:!ring-[#8fa31e] focus:[&_input]:!border-[#8fa31e]"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-[#f7f9e8] rounded-xl border border-[#d4de8a]/50">
                    <FaFilter className="text-[#8fa31e]" />
                    <Select
                      value={actionFilter}
                      onChange={(e) => handleActionFilterChange(e.target.value)}
                      className="!bg-transparent !border-none !p-0 !m-0 [&>select]:!bg-transparent [&>select]:!border-none [&>select]:!text-[#6b7d18] [&>select]:!font-medium"
                    >
                      <option value="">All Actions</option>
                      <option value="LOGIN">Login</option>
                      <option value="LOGOUT">Logout</option>
                      <option value="CREATE">Create</option>
                      <option value="UPDATE">Update</option>
                      <option value="DELETE">Delete</option>
                      <option value="STATUS_CHANGE">Status Change</option>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-[#f7f9e8] rounded-xl border border-[#d4de8a]/50">
                    <FaClock className="text-[#8fa31e]" />
                    <select
                      value={refreshInterval}
                      onChange={(e) => setRefreshInterval(Number(e.target.value))}
                      className="text-sm bg-transparent outline-none text-[#6b7d18] font-medium cursor-pointer"
                    >
                      <option value={0}>Manual</option>
                      <option value={10000}>10s</option>
                      <option value={30000}>30s</option>
                      <option value={60000}>1m</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Log List */}
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden mb-6" ref={contentRef}>
            <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-gray-800 text-lg">Activity Log</h2>
                <span className="px-3 py-1 bg-[#8fa31e]/10 text-[#6b7d18] text-xs font-bold rounded-full border border-[#8fa31e]/20">
                  {totalItems} entries
                </span>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8fa31e] to-[#a5b82e] flex items-center justify-center mb-5 shadow-xl shadow-[#8fa31e]/20">
                    <Spinner size="lg" color="success" />
                  </div>
                  <p className="text-[#6b7d18] font-semibold text-lg">Loading audit logs...</p>
                </div>
              ) : error && auditLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 px-4">
                  <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mb-5 border-2 border-red-100">
                    <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Unable to load logs</h3>
                  <p className="text-gray-500 text-center max-w-md mb-6">{error}</p>
                  <button
                    onClick={() => loadAuditLogs(true, currentPage)}
                    className="px-6 py-3 bg-gradient-to-r from-[#8fa31e] to-[#a5b82e] text-white rounded-xl hover:shadow-xl hover:shadow-[#8fa31e]/20 transition-all font-semibold"
                  >
                    Try again
                  </button>
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 px-4">
                  <div className="w-24 h-24 bg-[#f7f9e8] rounded-3xl flex items-center justify-center mb-5 border-2 border-[#d4de8a]/40">
                    <svg className="w-12 h-12 text-[#8fa31e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No logs found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredLogs.map((log) => {
                  const config = ACTION_CONFIG[log.action] || ACTION_CONFIG.UPDATE;
                  return (
                    <div key={log._id} className="px-6 sm:px-8 py-5 hover:bg-[#f7f9e8]/30 transition-all group">
                      <div className="flex items-start gap-5">
                        <div className={`w-12 h-12 rounded-2xl ${config.bg} ${config.text} flex items-center justify-center flex-shrink-0 border-2 ${config.border} group-hover:scale-105 transition-transform shadow-sm`}>
                          <span className="text-xl font-bold">{config.icon}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${config.bg} ${config.text} border ${config.border}`}>
                                {config.label}
                              </span>
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#8fa31e] to-[#a5b82e] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                                  {log.user?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <span className="font-semibold text-gray-800">{log.user || 'System'}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-5 text-sm">
                              <div className="flex items-center gap-2 text-[#6b7d18] font-medium">
                                <FaClock className="w-4 h-4" />
                                <span>{getRelativeTime(log.timestamp)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-500">
                                <FaDesktop className="w-4 h-4" />
                                <span>{log.ipAddress || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                            {log.details || 'No additional details'}
                          </p>
                          
                          <div className="mt-3 flex items-center gap-6 text-xs text-gray-400">
                            <span>Entity: <span className="text-[#6b7d18] font-semibold">{log.entityType || 'N/A'}</span></span>
                            {log.entityId && (
                              <span>ID: <span className="text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">{log.entityId.slice(-8)}</span></span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-[#6b7d18]/60 pb-4">
            Audit logs are automatically deleted after 180 days for data retention compliance
          </div>
        </div>
      </div>

      {/* Floating Pagination */}
      <FloatingPagination
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        label="entries"
      />
    </div>
  );
}
