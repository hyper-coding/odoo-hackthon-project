'use client'

import { useState } from 'react'
import { mockEmployees, mockSalaryStructures, SalaryStructure } from '@/lib/mockData'
import { Button } from '@/components/ui/button'
import { Edit2, Save, X, Search } from 'lucide-react'

export function PayrollAdmin() {
  const [salaries, setSalaries] = useState<Record<string, SalaryStructure>>(mockSalaryStructures)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<SalaryStructure | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEmployees = mockEmployees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = (employeeId: string) => {
    setEditingId(employeeId)
    setEditData({ ...salaries[employeeId] })
  }

  const handleSave = () => {
    if (editData && editingId) {
      const newNetPay = (editData.basicPay + editData.hra + editData.allowances) - editData.deductions
      setSalaries({
        ...salaries,
        [editingId]: {
          ...editData,
          netPay: newNetPay,
        },
      })
      setEditingId(null)
      setEditData(null)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData(null)
  }

  const handleInputChange = (field: keyof SalaryStructure, value: number) => {
    if (editData) {
      setEditData({ ...editData, [field]: value })
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Search Bar */}
      <div className="bg-card border border-border rounded-xl p-6">
        <label className="block text-sm font-medium mb-3">Search Employees</label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-foreground/50" />
          <input
            type="text"
            placeholder="Search by name, ID, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-4 px-6 font-semibold">Employee Name</th>
                <th className="text-left py-4 px-6 font-semibold">Employee ID</th>
                <th className="text-left py-4 px-6 font-semibold">Basic Pay</th>
                <th className="text-left py-4 px-6 font-semibold">HRA</th>
                <th className="text-left py-4 px-6 font-semibold">Allowances</th>
                <th className="text-left py-4 px-6 font-semibold">Deductions</th>
                <th className="text-left py-4 px-6 font-semibold">Net Pay</th>
                <th className="text-left py-4 px-6 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => {
                const salary = salaries[employee.employeeId]
                const isEditing = editingId === employee.employeeId

                return (
                  <tr key={employee.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-6 text-foreground font-medium">{employee.name}</td>
                    <td className="py-4 px-6 text-foreground/70 text-xs font-mono bg-muted/30 px-3 py-1 rounded w-fit">
                      {employee.employeeId}
                    </td>

                    {isEditing && editData ? (
                      <>
                        <td className="py-4 px-6">
                          <input
                            type="number"
                            value={editData.basicPay}
                            onChange={(e) => handleInputChange('basicPay', Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <input
                            type="number"
                            value={editData.hra}
                            onChange={(e) => handleInputChange('hra', Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <input
                            type="number"
                            value={editData.allowances}
                            onChange={(e) => handleInputChange('allowances', Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <input
                            type="number"
                            value={editData.deductions}
                            onChange={(e) => handleInputChange('deductions', Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-4 px-6 font-semibold text-blue-600">
                          ₹
                          {(
                            editData.basicPay +
                            editData.hra +
                            editData.allowances -
                            editData.deductions
                          ).toLocaleString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button
                              onClick={handleSave}
                              className="p-1.5 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                              title="Save"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-1.5 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 px-6 text-foreground">₹{salary?.basicPay.toLocaleString()}</td>
                        <td className="py-4 px-6 text-foreground">₹{salary?.hra.toLocaleString()}</td>
                        <td className="py-4 px-6 text-foreground">₹{salary?.allowances.toLocaleString()}</td>
                        <td className="py-4 px-6 text-foreground">₹{salary?.deductions.toLocaleString()}</td>
                        <td className="py-4 px-6 font-semibold text-blue-600">₹{salary?.netPay.toLocaleString()}</td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleEdit(employee.employeeId)}
                            className="p-1.5 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button variant="outline" className="w-full">
            Download All Payslips
          </Button>
          <Button variant="outline" className="w-full">
            Export to Excel
          </Button>
          <Button variant="outline" className="w-full">
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  )
}
