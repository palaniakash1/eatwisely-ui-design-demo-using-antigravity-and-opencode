import { useEffect, useState } from 'react';
import axios from '../services/axios';
import exemptBadge from '../assets/fhrs_exempt.png';

const getBadgeUrl = (rating) => {
  if (!rating || rating === 'Exempt') {
    return exemptBadge;
  }
  return `https://ratings.food.gov.uk/images/badges/fhrs/3/fhrs-badge-${rating}.svg`;
};

export default function FsaRating({ fhrsId, showLabel = true, size = 'md', className = '' }) {
  const [rating, setRating] = useState(null);
  const [badgeUrl, setBadgeUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };

  useEffect(() => {
    if (!fhrsId) {
      setLoading(false);
      setError('not_linked');
      return;
    }

    const fetchRating = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/fsa/rating/${fhrsId}`);

        if (res.data?.success && res.data?.data) {
          const ratingValue = res.data.data.rating;
          if (!ratingValue) {
            setError('no_rating');
            return;
          }
          setRating(ratingValue);
          setBadgeUrl(res.data.data.badgeUrl);
        } else {
          setError('not_found');
        }
      } catch (err) {
        console.error('FSA Rating Error:', err);
        setError('api_error');
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [fhrsId]);

  if (!fhrsId) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showLabel && (
          <span className="text-sm text-gray-400">
            Hygiene rating not available
          </span>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="bg-gray-200 animate-pulse h-8 w-20 rounded" />
        {showLabel && <span className="text-sm text-gray-400">Loading...</span>}
      </div>
    );
  }

  if (error || !badgeUrl) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showLabel && (
          <span className="text-sm text-gray-400">
            Hygiene rating not available
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={badgeUrl}
        alt={`FSA Hygiene Rating: ${rating}`}
        className={sizeClasses[size]}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Food Standards Agency</span>
          <span className="text-sm text-gray-700">
            {rating === 'Exempt' ? 'Exempt' : `Hygiene Rating: ${rating}/5`}
          </span>
        </div>
      )}
    </div>
  );
}
