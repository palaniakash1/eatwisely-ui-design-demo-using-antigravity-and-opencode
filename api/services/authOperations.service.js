export const getRefreshTokenFromRequest = (req) => {
  return req.cookies?.refresh_token || null;
};

export const listSessionsForUser = async ({ userId, refreshToken }) => {
  return [];
};

export const listSessionsForAdminTarget = async ({ userId }) => {
  return { status: 'not_found', sessions: [] };
};

export const revokeSessionForUser = async ({ sessionId, userId, reason }) => {
  return { status: 'not_found' };
};

export const revokeAllSessionsForUser = async ({ userId, refreshToken, reason }) => {
  return { revokedCount: 0 };
};

export const revokeAllSessionsForAdminTarget = async ({ userId, reason }) => {
  return { status: 'not_found', revokedCount: 0 };
};
