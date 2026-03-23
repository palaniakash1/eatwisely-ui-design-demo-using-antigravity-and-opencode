import { useState } from 'react';
import { BiCheck, BiX, BiSearch, BiRefresh } from 'react-icons/bi';
import exemptBadge from './../assets/fhrs_exempt.png';

const getBadgeUrl = (rating) => {
  if (!rating || rating === 'Exempt') {
    return exemptBadge;
  }
  return `https://ratings.food.gov.uk/images/badges/fhrs/3/fhrs-badge-${rating}.svg`;
};

export default function FSAMatchSelector({
  matches,
  onSelect,
  onCancel,
  isLoading = false,
  restaurantName = '',
  restaurantPostcode = ''
}) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = () => {
    if (selectedId) {
      const selected = matches.find((m) => m.fhrsId === selectedId);
      onSelect(selected);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <BiSearch className="text-xl text-blue-600" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Multiple Matches Found
          </h3>
          <p className="text-sm text-gray-500">
            We found {matches.length} establishments matching "{restaurantName}"
            {restaurantPostcode && ` in ${restaurantPostcode}`}
          </p>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {matches.map((match) => (
          <div
            key={match.fhrsId}
            onClick={() => setSelectedId(match.fhrsId)}
            className={`
              border-2 rounded-lg p-4 cursor-pointer transition-all
              ${
                selectedId === match.fhrsId
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div
                  className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${
                    selectedId === match.fhrsId
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }
                `}
                >
                  {selectedId === match.fhrsId && (
                    <BiCheck className="text-white text-sm" />
                  )}
                </div>
              </div>

              <div className="flex-grow min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{match.name}</h4>
                    {match.postcode && (
                      <p className="text-sm text-gray-500 mt-1">
                        {match.postcode}
                      </p>
                    )}
                  </div>
                  {match.rating && (
                    <img
                      src={getBadgeUrl(match.rating)}
                      alt={`Rating: ${match.rating}`}
                      className="h-10 flex-shrink-0"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <BiX /> Skip for now
        </button>
        <button
          onClick={handleSelect}
          disabled={!selectedId || isLoading}
          className={`
            px-4 py-2 rounded-lg transition-colors flex items-center gap-2
            ${
              selectedId && !isLoading
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <>
              <BiRefresh className="animate-spin" />
              Linking...
            </>
          ) : (
            <>
              <BiCheck />
              Link Selected
            </>
          )}
        </button>
      </div>
    </div>
  );
}
