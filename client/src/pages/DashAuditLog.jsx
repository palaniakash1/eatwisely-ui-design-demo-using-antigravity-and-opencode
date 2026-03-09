import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table, Badge, Button } from 'flowbite-react'
import { HiSearch } from 'react-icons/hi'
import { DashboardLayout, DashboardHeader, DashboardContent } from '../components/DashboardLayout'

const defaultAuditLogs = [
  { _id: '1', action: 'User Login', user: 'testuser', details: 'User logged in successfully', ipAddress: '192.168.1.1', timestamp: '2025-01-20T10:30:00Z' },
  { _id: '2', action: 'Create Restaurant', user: 'admin', details: 'Created "The Green Kitchen"', ipAddress: '192.168.1.2', timestamp: '2025-01-20T11:00:00Z' },
  { _id: '3', action: 'Update User', user: 'admin', details: 'Changed role to storeManager', ipAddress: '192.168.1.2', timestamp: '2025-01-20T11:30:00Z' },
  { _id: '4', action: 'Delete Menu Item', user: 'admin', details: 'Removed "Old Dish" from menu', ipAddress: '192.168.1.2', timestamp: '2025-01-20T12:00:00Z' },
  { _id: '5', action: 'User Registration', user: 'newuser', details: 'New user registered', ipAddress: '192.168.1.3', timestamp: '2025-01-20T13:00:00Z' },
  { _id: '6', action: 'Category Created', user: 'admin', details: 'Added "Vegan" category', ipAddress: '192.168.1.2', timestamp: '2025-01-20T14:00:00Z' },
  { _id: '7', action: 'Restaurant Published', user: 'admin', details: 'Published "Spice Route"', ipAddress: '192.168.1.2', timestamp: '2025-01-20T15:00:00Z' },
  { _id: '8', action: 'User Logout', user: 'testuser', details: 'User logged out', ipAddress: '192.168.1.1', timestamp: '2025-01-20T16:00:00Z' },
]

export default function DashAuditLog() {
  const { currentUser } = useSelector((state) => state.user)
  const [auditLogs, setAuditLogs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [actionFilter, setActionFilter] = useState([])

  useEffect(() => {
    const storedLogs = localStorage.getItem('auditLogs')
    if (storedLogs) {
      setAuditLogs(JSON.parse(storedLogs))
    } else {
      setAuditLogs(defaultAuditLogs)
      localStorage.setItem('auditLogs', JSON.stringify(defaultAuditLogs))
    }
  }, [])

  const actionTypes = [...new Set(auditLogs.map(log => log.action))]

  const actionOptions = actionTypes.map(action => ({
    value: action,
    label: action,
    selected: actionFilter.includes(action)
  }))

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = actionFilter.length === 0 || actionFilter.includes(log.action)
    return matchesSearch && matchesAction
  })

  const totalItems = filteredLogs.length
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage)

  const handleActionFilterChange = (value) => {
    setActionFilter(prev => prev.includes(value) ? prev.filter(a => a !== value) : [...prev, value])
    setCurrentPage(1)
  }

  const addAuditLog = (action, user, details) => {
    const newLog = {
      _id: Date.now().toString(),
      action,
      user: user || currentUser?.userName,
      details,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString()
    }
    const updatedLogs = [newLog, ...auditLogs]
    setAuditLogs(updatedLogs)
    localStorage.setItem('auditLogs', JSON.stringify(updatedLogs))
  }

  const getActionBadgeColor = (action) => {
    if (action.includes('Login') || action.includes('Logout')) return 'blue'
    if (action.includes('Create') || action.includes('Add')) return 'success'
    if (action.includes('Update') || action.includes('Change')) return 'warning'
    if (action.includes('Delete') || action.includes('Remove')) return 'failure'
    return 'gray'
  }

  return (
    <DashboardLayout activeTab="auditlog" pageTitle="Audit Log">
      <DashboardHeader
        title="Audit Log"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={actionOptions}
        onFilterChange={handleActionFilterChange}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
      <DashboardContent>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table hoverable>
            <Table.Head className="bg-gray-50">
              <Table.HeadCell>Timestamp</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>Details</Table.HeadCell>
              <Table.HeadCell>IP Address</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {paginatedLogs.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center py-8 text-gray-500">
                    No audit logs found
                  </Table.Cell>
                </Table.Row>
              ) : (
                paginatedLogs.map((log) => (
                  <Table.Row key={log._id} className="bg-white">
                    <Table.Cell className="whitespace-nowrap text-sm">
                      {new Date(log.timestamp).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={getActionBadgeColor(log.action)}>{log.action}</Badge>
                    </Table.Cell>
                    <Table.Cell className="font-medium">{log.user}</Table.Cell>
                    <Table.Cell className="text-gray-600">{log.details}</Table.Cell>
                    <Table.Cell className="text-sm text-gray-500">{log.ipAddress}</Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      </DashboardContent>
    </DashboardLayout>
  )
}
