import { useState, useEffect } from 'react';
import {
  BiLink,
  BiUnlink,
  BiRefresh,
  BiSearch,
  BiCheck,
  BiX
} from 'react-icons/bi';
import FsaRating from './FsaRating.jsx';
import FSAMatchSelector from './FSAMatchSelector.jsx';
import { toast } from './Toast.jsx';
import fsaApi from '../services/fsaApi.js';

export default function FSARatingManager({
  restaurant,
  onUpdate,
  isEditable = true
}) {
  const [loading, setLoading] = useState(false);
  const [showMatchSelector, setShowMatchSelector] = useState(false);
  const [matchOptions, setMatchOptions] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    name: restaurant?.name || '',
    postcode: restaurant?.address?.postcode || ''
  });

  useEffect(() => {
    if (restaurant) {
      setSearchQuery({
        name: restaurant.name || '',
        postcode: restaurant.address?.postcode || ''
      });
    }
  }, [restaurant]);

  const handleAutoLink = async () => {
    if (!restaurant?._id) return;

    setLoading(true);
    try {
      const result = await fsaApi.autoLinkRestaurant(restaurant._id);

      if (result.data?.linked && result.data?.result) {
        toast.success('Successfully linked to FSA rating');
        if (onUpdate) onUpdate(result.data);
        setShowSearch(false);
      } else if (result.data?.multipleOptions) {
        setMatchOptions(result.data.multipleOptions);
        setShowMatchSelector(true);
      } else {
        toast.info(result.data?.message || 'No matching establishment found');
        setShowSearch(true);
      }
    } catch (error) {
      toast.error('Failed to auto-link: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = async () => {
    if (!searchQuery.name.trim()) {
      toast.error('Please enter a restaurant name');
      return;
    }

    setLoading(true);
    try {
      const result = await fsaApi.searchFSA(
        searchQuery.name,
        searchQuery.postcode
      );

      if (result.data?.matched) {
        if (
          result.data?.multipleOptions &&
          result.data.multipleOptions.length > 1
        ) {
          setMatchOptions(result.data.multipleOptions);
          setShowMatchSelector(true);
        } else {
          setSearchResult(result.data.result);
        }
      } else if (
        result.data?.multipleOptions &&
        result.data.multipleOptions.length > 1
      ) {
        setMatchOptions(
          result.data.multipleOptions.map((est) => ({
            fhrsId: est.FHRSID,
            name: est.BusinessName,
            postcode: est.PostCode,
            rating: est.RatingValue
          }))
        );
        setShowMatchSelector(true);
      } else {
        toast.info('No matching establishments found');
        setSearchResult(null);
      }
    } catch (error) {
      toast.error('Search failed: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMatch = async (selected) => {
    if (!restaurant?._id || !selected?.FHRSID) return;

    setLoading(true);
    try {
      const result = await fsaApi.linkRestaurant(
        restaurant._id,
        selected.FHRSID
      );
      toast.success('Successfully linked to FSA rating');
      if (onUpdate) onUpdate(result.data);
      setShowMatchSelector(false);
      setShowSearch(false);
    } catch (error) {
      toast.error('Failed to link: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!restaurant?._id) return;

    setLoading(true);
    try {
      const result = await fsaApi.refreshRestaurantRating(restaurant._id);
      toast.success('Rating refreshed successfully');
      if (onUpdate) onUpdate(result.data);
    } catch (error) {
      toast.error('Failed to refresh: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleUnlink = async () => {
    if (!restaurant?._id) return;

    if (
      !confirm(
        'Are you sure you want to unlink this restaurant from FSA rating?'
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await fsaApi.unlinkRestaurant(restaurant._id);
      toast.success('Successfully unlinked from FSA rating');
      if (onUpdate)
        onUpdate({ linked: false, fhrsId: null, rating: null, badgeUrl: null });
    } catch (error) {
      toast.error('Failed to unlink: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const isLinked = restaurant?.fhrsId && restaurant?.fsaRating?.value;

  return (
    <div className="space-y-4">
      {showMatchSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <FSAMatchSelector
            matches={matchOptions}
            onSelect={handleSelectMatch}
            onCancel={() => setShowMatchSelector(false)}
            isLoading={loading}
            restaurantName={searchQuery.name}
            restaurantPostcode={searchQuery.postcode}
          />
        </div>
      )}

      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">FSA Hygiene Rating</h4>
          {isLinked && isEditable && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Refresh rating"
              >
                <BiRefresh className={loading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={handleUnlink}
                disabled={loading}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Unlink"
              >
                <BiUnlink />
              </button>
            </div>
          )}
        </div>

        {isLinked ? (
          <div className="flex items-center gap-4">
            <FsaRating fhrsId={restaurant.fhrsId} size="md" />
            {restaurant.fsaRating?.lastRefreshed && (
              <span className="text-xs text-gray-400">
                Updated:{' '}
                {new Date(
                  restaurant.fsaRating.lastRefreshed
                ).toLocaleDateString()}
              </span>
            )}
          </div>
        ) : isEditable ? (
          <div className="space-y-4">
            {showSearch ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    value={searchQuery.name}
                    onChange={(e) =>
                      setSearchQuery((q) => ({ ...q, name: e.target.value }))
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter restaurant name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postcode (optional)
                  </label>
                  <input
                    type="text"
                    value={searchQuery.postcode}
                    onChange={(e) =>
                      setSearchQuery((q) => ({
                        ...q,
                        postcode: e.target.value
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter postcode"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleManualSearch}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <BiSearch /> Search
                  </button>
                  <button
                    onClick={() => setShowSearch(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleAutoLink}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <BiLink />
                  {loading ? 'Searching...' : 'Auto-link'}
                </button>
                <button
                  onClick={() => setShowSearch(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                >
                  <BiSearch />
                  Manual Search
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No FSA rating linked</p>
        )}
      </div>
    </div>
  );
}
