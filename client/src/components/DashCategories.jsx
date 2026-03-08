import { useState } from 'react'
import { Card, Table, Button, Label, TextInput, Select } from 'flowbite-react'
import { HiPlus, HiPencil, HiTrash, HiSearch } from 'react-icons/hi'

export default function DashCategories() {
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button className="bg-[#8fa31e]">
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
    </div>
  )
}
