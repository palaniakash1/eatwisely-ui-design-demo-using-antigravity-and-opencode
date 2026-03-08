import { useState } from 'react'
import { Card, Table, Button, TextInput, Badge } from 'flowbite-react'
import { HiSearch, HiPencil, HiTrash, HiUserAdd } from 'react-icons/hi'
import ImageCircleLoader from './ImageCircleLoader'

export default function DashUsers() {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button className="bg-[#8fa31e]">
          <HiUserAdd className="mr-2" />
          Add User
        </Button>
      </div>

      <Card className="mb-6">
        <TextInput
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={HiSearch}
        />
      </Card>

      <Card>
        <Table>
          <Table.Head>
            <Table.HeadCell>User</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Role</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {filteredUsers.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={5} className="text-center text-gray-500">
                  No users found
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredUsers.map((user) => (
                <Table.Row key={user._id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <ImageCircleLoader
                        src={user.profilePicture}
                        alt={user.username}
                        size={40}
                      />
                      <span className="font-medium">{user.username}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    <Badge color={user.role === 'admin' ? 'purple' : 'gray'}>
                      {user.role}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={user.isActive ? 'success' : 'failure'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Table.Cell>
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
