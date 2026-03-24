import { useState, useEffect, useCallback } from 'react';
import { TextInput } from 'flowbite-react';
import { autocompleteAddress, getPlaceDetails } from '../services/placesApi';

export default function AddressAutocomplete({ onAddressSelect, onLocationSelect }) {
  const [searchValue, setSearchValue] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchValue.length > 2 && searchValue !== selectedAddress) {
        setLoading(true);
        setError(null);
        try {
          const result = await autocompleteAddress(searchValue);
          if (result.success) {
            setPredictions(result.data);
          }
        } catch (err) {
          setError(err.message || 'Failed to fetch suggestions');
          setPredictions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setPredictions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchValue, selectedAddress]);

  const handleSelect = async (prediction) => {
    setSearchValue(prediction.description);
    setSelectedAddress(prediction.description);
    setPredictions([]);
    setError(null);

    if (onAddressSelect) {
      onAddressSelect(prediction.description);
    }

    if (onLocationSelect && prediction.placeId) {
      try {
        const details = await getPlaceDetails(prediction.placeId);
        if (details.success && onLocationSelect) {
          onLocationSelect(details.data);
        }
      } catch (err) {
        console.error('Failed to get place details:', err);
      }
    }
  };

  return (
    <div className="relative">
      <TextInput
        type="text"
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          setSelectedAddress('');
        }}
        placeholder="Start typing your address..."
        className="w-full"
      />
      {loading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      {predictions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction) => (
            <li
              key={prediction.placeId}
              onClick={() => handleSelect(prediction)}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {prediction.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}