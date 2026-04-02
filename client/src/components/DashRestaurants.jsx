import { useState, useCallback } from 'react'
import { Card, Table, Button, TextInput, Textarea, Label, Badge } from 'flowbite-react'
import { HiPlus, HiPencil, HiTrash, HiSearch, HiLocationMarker, HiUpload } from 'react-icons/hi'
import ImageUploadCropper from './ImageUploadCropper'

const formatAddress = (address) => {
  if (!address) return ''
  if (typeof address === 'string') return address
  const parts = [
    address.addressLine1,
    address.areaLocality,
    address.city,
    address.postcode
  ].filter(Boolean)
  return parts.join(', ')
}

export default function DashRestaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [coverImage, setCoverImage] = useState(null)
  const [coverImagePreview, setCoverImagePreview] = useState(null)

  const handleCroppedImage = useCallback((croppedFile) => {
    setCoverImage(croppedFile)
    setCoverImagePreview(URL.createObjectURL(croppedFile))
  }, [])

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Restaurants</h1>
        <Button className="bg-[#8fa31e]" onClick={() => setShowForm(!showForm)}>
          <HiPlus className="mr-2" />
          Add Restaurant
        </Button>
      </div>

      <Card className="mb-6">
        <TextInput
          type="text"
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={HiSearch}
        />
      </Card>

      {showForm && (
        <Card className="mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Restaurant</h2>
          <form className="flex flex-col gap-4">
            <div>
              <Label htmlFor="name" value="Restaurant Name" />
              <TextInput id="name" placeholder="Enter restaurant name" />
            </div>
            <div>
              <Label htmlFor="description" value="Description" />
              <Textarea id="description" rows={3} placeholder="Restaurant description" />
            </div>
            <div>
              <Label htmlFor="address" value="Address" />
              <TextInput id="address" placeholder="Enter address" icon={HiLocationMarker} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" value="Phone" />
                <TextInput id="phone" placeholder="Phone number" />
              </div>
              <div>
                <Label htmlFor="website" value="Website" />
                <TextInput id="website" placeholder="Website URL" />
              </div>
            </div>
            <div>
              <Label htmlFor="image" value="Cover Image" />
              <ImageUploadCropper
                onCropComplete={handleCroppedImage}
                maxFileSizeMB={2}
              >
                <div className="mt-2 w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#8fa31e] hover:bg-gray-50 transition-all">
                  {coverImagePreview ? (
                    <img src={coverImagePreview} alt="Cover preview" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <>
                      <HiUpload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Click to upload cover image</span>
                    </>
                  )}
                </div>
              </ImageUploadCropper>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-[#8fa31e]">Save</Button>
              <Button color="gray" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <Table>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Address</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {filteredRestaurants.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={4} className="text-center text-gray-500">
                  No restaurants found
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredRestaurants.map((restaurant) => (
                <Table.Row key={restaurant._id}>
                  <Table.Cell className="font-medium">{restaurant.name}</Table.Cell>
                  <Table.Cell>{formatAddress(restaurant.address)}</Table.Cell>
                  <Table.Cell>
                    <Badge color={restaurant.isVerified ? 'success' : 'warning'}>
                      {restaurant.isVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button size="xs" color="blue">
                        <HiPencil className="mr-1" /> Edit
                      </Button>
                      <Button size="xs" color="failure">
                        <HiTrash className="mr-1" /> Delete
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </Card>
    </div>
  )
}
