import User from '../models/user.model.js';
import Restaurant from '../models/restaurant.model.js';
import Menu from '../models/menu.model.js';
import Category from '../models/category.model.js';
import AuditLog from '../models/auditLog.model.js';
import Review from '../models/review.model.js';
import { traceDatabaseOperation } from '../tracing.js';

export const getOverviewStats = async () => {
  return traceDatabaseOperation('dashboardGetOverviewStats', async () => {
    const [userStats, restaurantStats, categoryStats, menuStats, auditStats, reviewStats] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: ['$isActive', 1, 0] } },
            newThisWeek: {
              $sum: {
                $cond: [
                  { $gte: ['$createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                  1,
                  0
                ]
              }
            },
            newThisMonth: {
              $sum: {
                $cond: [
                  { $gte: ['$createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
                  1,
                  0
                ]
              }
            }
          }
        },
        { $project: { _id: 0 } }
      ]),
      Restaurant.aggregate([
        { $match: { deletedAt: null } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            published: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
            draft: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
            blocked: { $sum: { $cond: [{ $eq: ['$status', 'blocked'] }, 1, 0] } },
            newThisWeek: {
              $sum: {
                $cond: [
                  { $gte: ['$createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                  1,
                  0
                ]
              }
            },
            newThisMonth: {
              $sum: {
                $cond: [
                  { $gte: ['$createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
                  1,
                  0
                ]
              }
            }
          }
        },
        { $project: { _id: 0 } }
      ]),
      Category.aggregate([
        { $match: { deletedAt: null } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: ['$isActive', 1, 0] } },
            generic: { $sum: { $cond: ['$isGeneric', 1, 0] } },
            newThisWeek: {
              $sum: {
                $cond: [
                  { $gte: ['$createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                  1,
                  0
                ]
              }
            },
            newThisMonth: {
              $sum: {
                $cond: [
                  { $gte: ['$createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
                  1,
                  0
                ]
              }
            }
          }
        },
        { $project: { _id: 0 } }
      ]),
      Menu.aggregate([
        { $match: { deletedAt: null } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            published: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
            draft: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
            totalItems: { $sum: { $size: { $ifNull: ['$items', []] } } },
            newThisWeek: {
              $sum: {
                $cond: [
                  { $gte: ['$createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                  1,
                  0
                ]
              }
            },
            newThisMonth: {
              $sum: {
                $cond: [
                  { $gte: ['$createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
                  1,
                  0
                ]
              }
            }
          }
        },
        { $project: { _id: 0 } }
      ]),
      AuditLog.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            thisWeek: {
              $sum: {
                $cond: [
                  { $gte: ['$createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                  1,
                  0
                ]
              }
            },
            thisMonth: {
              $sum: {
                $cond: [
                  { $gte: ['$createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
                  1,
                  0
                ]
              }
            }
          }
        },
        { $project: { _id: 0 } }
      ]),
      Review.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            thisWeek: {
              $sum: {
                $cond: [
                  { $gte: ['$createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                  1,
                  0
                ]
              }
            },
            thisMonth: {
              $sum: {
                $cond: [
                  { $gte: ['$createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
                  1,
                  0
                ]
              }
            }
          }
        },
        { $project: { _id: 0 } }
      ])
    ]);

    return {
      users: userStats[0] || { total: 0, active: 0, newThisWeek: 0, newThisMonth: 0 },
      restaurants: restaurantStats[0] || { total: 0, published: 0, draft: 0, blocked: 0, newThisWeek: 0, newThisMonth: 0 },
      categories: categoryStats[0] || { total: 0, active: 0, generic: 0, newThisWeek: 0, newThisMonth: 0 },
      menus: menuStats[0] || { total: 0, published: 0, draft: 0, totalItems: 0, newThisWeek: 0, newThisMonth: 0 },
      auditLogs: auditStats[0] || { total: 0, thisWeek: 0, thisMonth: 0 },
      reviews: reviewStats[0] || { total: 0, thisWeek: 0, thisMonth: 0 }
    };
  });
};

export const getUserAnalytics = async (days = 30) => {
  return traceDatabaseOperation('dashboardGetUserAnalytics', async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const signups = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', signups: '$count', _id: 0 } }
    ]);

    const logins = await AuditLog.aggregate([
      {
        $match: {
          action: 'LOGIN',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', logins: '$count', _id: 0 } }
    ]);

    const visitors = await AuditLog.aggregate([
      {
        $match: {
          action: { $in: ['LOGIN', 'REFRESH'] },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', visitors: '$count', _id: 0 } }
    ]);

    const allDates = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      allDates.push(date.toISOString().split('T')[0]);
    }

    const signupMap = new Map(signups.map(s => [s.date, s.signups]));
    const loginMap = new Map(logins.map(l => [l.date, l.logins]));
    const visitorMap = new Map(visitors.map(v => [v.date, v.visitors]));

    return allDates.map(date => ({
      date,
      signups: signupMap.get(date) || 0,
      logins: loginMap.get(date) || 0,
      visitors: visitorMap.get(date) || 0
    }));
  });
};

export const getContentAnalytics = async (days = 30) => {
  return traceDatabaseOperation('dashboardGetContentAnalytics', async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const restaurantCreations = await Restaurant.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', restaurants: '$count', _id: 0 } }
    ]);

    const menuCreations = await Menu.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', menus: '$count', _id: 0 } }
    ]);

    const categoryCreations = await Category.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', categories: '$count', _id: 0 } }
    ]);

    const allDates = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      allDates.push(date.toISOString().split('T')[0]);
    }

    const restaurantMap = new Map(restaurantCreations.map(r => [r.date, r.restaurants]));
    const menuMap = new Map(menuCreations.map(m => [m.date, m.menus]));
    const categoryMap = new Map(categoryCreations.map(c => [c.date, c.categories]));

    return allDates.map(date => ({
      date,
      restaurants: restaurantMap.get(date) || 0,
      menus: menuMap.get(date) || 0,
      categories: categoryMap.get(date) || 0
    }));
  });
};

export const getUserRolesDistribution = async () => {
  return traceDatabaseOperation('dashboardGetUserRolesDistribution', async () => {
    return User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          active: { $sum: { $cond: ['$isActive', 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);
  });
};

export const getRecentActivity = async (limit = 10) => {
  return traceDatabaseOperation('dashboardGetRecentActivity', async () => {
    return AuditLog.find()
      .populate('actorId', 'userName email role profilePicture')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  });
};

export const getRealtimeStats = async () => {
  return traceDatabaseOperation('dashboardGetRealtimeStats', async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayStats, activeNow, hourlyVisitors] = await Promise.all([
      Promise.all([
        User.countDocuments({ createdAt: { $gte: today } }),
        AuditLog.countDocuments({ action: 'LOGIN', createdAt: { $gte: today } }),
        Restaurant.countDocuments({ createdAt: { $gte: today } }),
        Menu.countDocuments({ createdAt: { $gte: today } }),
        Category.countDocuments({ createdAt: { $gte: today } })
      ]),
      AuditLog.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) } } },
        { $group: { _id: '$actorId' } },
        { $count: 'activeUsers' }
      ]),
      AuditLog.aggregate([
        {
          $match: {
            action: { $in: ['LOGIN', 'REFRESH'] },
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d %H:00', date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    return {
      today: {
        newUsers: todayStats[0],
        logins: todayStats[1],
        newRestaurants: todayStats[2],
        newMenus: todayStats[3],
        newCategories: todayStats[4]
      },
      activeNow: activeNow[0]?.activeUsers || 0,
      hourlyVisitors: hourlyVisitors
    };
  });
};

export const getDashboardSummary = async () => {
  const [overview, userAnalytics, contentAnalytics, rolesDistribution, recentActivity, realtime] = await Promise.all([
    getOverviewStats(),
    getUserAnalytics(7),
    getContentAnalytics(7),
    getUserRolesDistribution(),
    getRecentActivity(20),
    getRealtimeStats()
  ]);

  return {
    overview,
    userAnalytics,
    contentAnalytics,
    rolesDistribution,
    recentActivity,
    realtime
  };
};

export default {
  getOverviewStats,
  getUserAnalytics,
  getContentAnalytics,
  getUserRolesDistribution,
  getRecentActivity,
  getRealtimeStats,
  getDashboardSummary
};
