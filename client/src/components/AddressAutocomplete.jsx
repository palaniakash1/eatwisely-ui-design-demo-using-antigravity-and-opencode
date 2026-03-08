import { useState, useCallback } from 'react'
import { useLoadScript } from '@react-google-maps/api'
import { TextInput } from 'flowbite-react'

const libraries = ['places']

export default function AddressAutocomplete({ onAddressSelect }) {
  const [searchValue, setSearchValue] = useState('')
  const [predictions, setPredictions] = useState([])
  const [selectedAddress, setSelectedAddress] = useState('')

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  })

  const handleChange = async (e) => {
    const value = e.target.value
    setSearchValue(value)
    setSelectedAddress('')

    if (value.length > 3 && isLoaded) {
      const service = new window.google.maps.places.AutocompleteService()
      service.getPlacePredictions(
        { input: value },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setPredictions(predictions)
          }
        }
      )
    }
  }

  const handleSelect = (prediction) => {
    setSearchValue(prediction.description)
    setSelectedAddress(prediction.description)
    setPredictions([])
    if (onAddressSelect) {
      onAddressSelect(prediction.description)
    }
  }

  if (loadError) return <div>Error loading maps</div>
  if (!isLoaded) return <div>Loading maps...</div>

  return (
    <div className="relative">
      <TextInput
        type="text"
        value={searchValue}
        onChange={handleChange}
        placeholder="Enter address"
        className="w-full"
      />
      {predictions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg">
          {predictions.map((prediction) => (
            <li
              key={prediction.place_id}
              onClick={() => handleSelect(prediction)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {prediction.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
