import { useState } from 'react'
import AddressAutocomplete from '../components/AddressAutocomplete'
import { Card } from 'flowbite-react'

export default function AutoComplete() {
  const [selectedAddress, setSelectedAddress] = useState('')

  return (
    <div className="min-h-screen bg-[#f1f8eb] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <h1 className="text-2xl font-bold mb-6 text-center">Search Location</h1>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your address
            </label>
            <AddressAutocomplete onAddressSelect={setSelectedAddress} />
          </div>

          {selectedAddress && (
            <div className="mt-6 p-4 bg-[#f1f8eb] rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Selected Address:</p>
              <p className="font-medium">{selectedAddress}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
