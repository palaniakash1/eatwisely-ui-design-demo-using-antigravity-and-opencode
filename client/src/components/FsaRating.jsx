import { useEffect, useState } from 'react';
import axios from 'axios';

export default function FsaRating({ fhrsId }) {
  const [rating, setRating] = useState(null);
  const [badgeUrl, setBadgeUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const getBadgeUrl = (rating) => {
    if (!rating || rating === 'Exempt') {
      return 'https://ratings.food.gov.uk/images/badges/fhrs/3/fhrs-badge-exempt.svg';
    }
    return `https://ratings.food.gov.uk/images/badges/fhrs/3/fhrs-badge-${rating}.svg`;
  };

  useEffect(() => {
    if (!fhrsId) return;

    const fetchRating = async () => {
      try {
        const res = await axios.get(
          `https://api.ratings.food.gov.uk/establishments/${fhrsId}`,
          {
            headers: {
              'x-api-version': '2'
            }
          }
        );

        const value = res.data.RatingValue;
        setRating(value);
        setBadgeUrl(getBadgeUrl(value));
      } catch (err) {
        console.error('FSA Rating Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [fhrsId]);

  if (!fhrsId) return null;

  if (loading) {
    return <p className="text-sm text-gray-400">Loading hygiene rating...</p>;
  }

  if (!badgeUrl) {
    return <p className="text-sm text-red-400">Rating unavailable</p>;
  }

  return (
    <div className="flex items-center gap-3 mt-2">
      <img src={badgeUrl} alt={`FSA Rating ${rating}`} className="h-12" />
      <span className="text-sm text-gray-600">
        Hygiene Rating: <strong>{rating}</strong>
      </span>
    </div>
  );
}
