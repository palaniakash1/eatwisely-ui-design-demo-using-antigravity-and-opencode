import { useState, useCallback } from 'react'
import { Card, Table, Button, Label, TextInput, Select, Modal } from 'flowbite-react'
import { HiPlus, HiPencil, HiTrash, HiSearch, HiUpload } from 'react-icons/hi'
import { TbCategory2 } from 'react-icons/tb';

import ImageUploadCropper from './ImageUploadCropper'

export default function DashCategories() {
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', image: '' })
  const [categoryImage, setCategoryImage] = useState(null)
  const [categoryImagePreview, setCategoryImagePreview] = useState(null)

  const handleCroppedImage = useCallback((croppedFile) => {
    setCategoryImage(croppedFile)
    setCategoryImagePreview(URL.createObjectURL(croppedFile))
    setFormData((prev) => ({ ...prev, image: URL.createObjectURL(croppedFile) }))
  }, [])

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button className="bg-[#8fa31e]" onClick={() => { setEditingCategory(null); setFormData({ name: '', slug: '', description: '', image: '' }); setCategoryImage(null); setCategoryImagePreview(null); setShowModal(true); }}>
          <HiPlus className="mr-2" />
          Add Category
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <TextInput
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={HiSearch}
            />
          </div>
        </div>
      </Card>

      <Card>
        <Table>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Slug</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {filteredCategories.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={4} className="text-center text-gray-500">
                  No categories found
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredCategories.map((category) => (
                <Table.Row key={category._id}>
                  <Table.Cell>{category.name}</Table.Cell>
                  <Table.Cell>{category.slug}</Table.Cell>
                  <Table.Cell>{category.description}</Table.Cell>
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

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>{editingCategory ? 'Edit Category' : 'Add Category'}</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div className="flex justify-center">
              <ImageUploadCropper
                onCropComplete={handleCroppedImage}
                aspectRatio={1}
                maxFileSizeMB={2}
              >
                <div className="relative cursor-pointer group">
                  <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
                    {categoryImagePreview || formData.image ? (
                      <img src={categoryImagePreview || formData.image} alt="Category" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
                        <HiUpload className="w-8 h-8 text-gray-400" />
                        <span className="text-xs text-gray-400 mt-1">Upload</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#8fa31e] text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <HiPlus className="w-4 h-4" />
                  </div>
                </div>
              </ImageUploadCropper>
            </div>
            <div>
              <Label htmlFor="name" value="Category Name" />
              <TextInput
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
            <div>
              <Label htmlFor="slug" value="Slug" />
              <TextInput
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="category-slug"
              />
            </div>
            <div>
              <Label htmlFor="description" value="Description" />
              <TextInput
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)} className="bg-[#8fa31e]">
            {editingCategory ? 'Update' : 'Add'}
          </Button>
          <Button color="gray" onClick={() => setShowModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
