import { useState } from 'react'
import { Card, Table, Button, TextInput, Textarea, Label, FileInput } from 'flowbite-react'
import { HiPlus, HiPencil, HiTrash, HiPhotograph } from 'react-icons/hi'

export default function DashMenu() {
  const [menuItems, setMenuItems] = useState([])
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Menu Items</h1>
        <Button className="bg-[#8fa31e]" onClick={() => setShowForm(!showForm)}>
          <HiPlus className="mr-2" />
          Add Menu Item
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Menu Item</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" value="Item Name" />
              <TextInput id="name" placeholder="Enter item name" />
            </div>
            <div>
              <Label htmlFor="price" value="Price" />
              <TextInput id="price" type="number" placeholder="0.00" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description" value="Description" />
              <Textarea id="description" rows={3} placeholder="Item description" />
            </div>
            <div>
              <Label htmlFor="category" value="Category" />
              <select id="category" className="w-full border-gray-300 rounded-md p-2">
                <option>Select category</option>
              </select>
            </div>
            <div>
              <Label htmlFor="image" value="Image" />
              <FileInput id="image" accept="image/*" />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" className="bg-[#8fa31e]">Save</Button>
              <Button color="gray" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <Table>
          <Table.Head>
            <Table.HeadCell>Image</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {menuItems.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={5} className="text-center text-gray-500">
                  No menu items found
                </Table.Cell>
              </Table.Row>
            ) : (
              menuItems.map((item) => (
                <Table.Row key={item._id}>
                  <Table.Cell>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <HiPhotograph className="w-12 h-12 text-gray-300" />
                    )}
                  </Table.Cell>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.category}</Table.Cell>
                  <Table.Cell>${item.price}</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button size="xs" color="blue">
                        <HiPencil className="mr-1" />
                      </Button>
                      <Button size="xs" color="failure">
                        <HiTrash className="mr-1" />
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
