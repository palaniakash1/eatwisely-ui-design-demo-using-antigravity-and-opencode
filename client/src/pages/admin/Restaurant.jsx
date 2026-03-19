import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { TextInput, Textarea, Select, Button, Label, Checkbox, FileInput } from "flowbite-react";
import { FaSave, FaUpload } from "react-icons/fa";

const defaultRestaurant = {
  name: "",
  slug: "",
  tagline: "",
  description: "",
  addressLine1: "",
  addressLine2: "",
  areaLocality: "",
  city: "London",
  countyRegion: "Greater London",
  postcode: "",
  country: "United Kingdom",
  contactNumber: "",
  email: "",
  website: "",
  status: "draft",
  isActive: true,
  isFeatured: false,
  isTrending: false,
  coverImage: "",
};

export default function AdminRestaurant() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState(defaultRestaurant);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRestaurant, setHasRestaurant] = useState(false);

  useEffect(() => {
    const storedRestaurant = localStorage.getItem(`admin_restaurant_${currentUser?._id}`);
    if (storedRestaurant) {
      setFormData(JSON.parse(storedRestaurant));
      setHasRestaurant(true);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const restaurantData = {
        ...formData,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        adminId: currentUser?._id,
        updatedAt: new Date().toISOString(),
      };
      
      if (!hasRestaurant) {
        restaurantData.createdAt = new Date().toISOString();
        restaurantData._id = Date.now().toString();
      }
      
      localStorage.setItem(`admin_restaurant_${currentUser?._id}`, JSON.stringify(restaurantData));
      setHasRestaurant(true);
      alert("Restaurant saved successfully!");
    } catch (error) {
      alert("Failed to save restaurant");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, coverImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {hasRestaurant ? "Edit Restaurant" : "Create Restaurant"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your restaurant details and information
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" value="Restaurant Name *" />
                <TextInput
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter restaurant name"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="slug" value="Slug" />
                <TextInput
                  id="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="auto-generated if empty"
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="tagline" value="Tagline" />
                <TextInput
                  id="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="A short description for your restaurant"
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description" value="Description" />
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your restaurant..."
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Address</h3>
              </div>
              <div>
                <Label htmlFor="addressLine1" value="Address Line 1" />
                <TextInput
                  id="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="Street address"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="addressLine2" value="Address Line 2" />
                <TextInput
                  id="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  placeholder="Apartment, suite, etc."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="areaLocality" value="Area/Locality" />
                <TextInput
                  id="areaLocality"
                  value={formData.areaLocality}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="city" value="City" />
                <TextInput
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="countyRegion" value="County/Region" />
                <TextInput
                  id="countyRegion"
                  value={formData.countyRegion}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="postcode" value="Postcode" />
                <TextInput
                  id="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="country" value="Country" />
                <TextInput
                  id="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact</h3>
              </div>
              <div>
                <Label htmlFor="contactNumber" value="Contact Number" />
                <TextInput
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="+44..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="website" value="Website" />
                <TextInput
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Settings</h3>
              </div>
              <div>
                <Label htmlFor="status" value="Status" />
                <Select
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="closed">Closed Temporarily</option>
                </Select>
              </div>
              <div></div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <Label htmlFor="isActive" value="Active" />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                />
                <Label htmlFor="isFeatured" value="Featured" />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isTrending"
                  checked={formData.isTrending}
                  onChange={handleChange}
                />
                <Label htmlFor="isTrending" value="Trending" />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Images</h3>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="coverImage" value="Cover Image" />
                <div className="mt-1 flex items-center gap-4">
                  <FileInput
                    id="coverImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                  {formData.coverImage && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={formData.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button type="button" color="gray">
                Cancel
              </Button>
              <Button
                type="submit"
                color="green"
                isProcessing={isLoading}
              >
                <FaSave className="w-4 h-4 mr-2" />
                {hasRestaurant ? "Update Restaurant" : "Create Restaurant"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
