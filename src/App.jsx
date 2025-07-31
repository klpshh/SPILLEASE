import { useState } from 'react'
import './App.css'

// Main App Component - SplitEase Bill Splitter
function App() {
  // State management for our app
  const [bills, setBills] = useState([]) // Store all bills
  const [currentBill, setCurrentBill] = useState({
    title: '',
    totalAmount: '',
    date: '',
    members: [],
    payments: []
  })
  const [showForm, setShowForm] = useState(false) // Toggle bill creation form
  const [editingBillIndex, setEditingBillIndex] = useState(null) // Track which bill we're editing

  // Add a new member to the current bill
  const addMember = () => {
    const newMember = {
      name: '',
      owes: 0,
      hasPaid: false,
      id: Date.now() // Unique ID for each member
    }
    setCurrentBill(prev => ({
      ...prev,
      members: [...prev.members, newMember]
    }))
  }

  // Update member details (name, amount owed, payment status)
  const updateMember = (index, field, value) => {
    setCurrentBill(prev => ({
      ...prev,
      members: prev.members.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }))
  }

  // Remove a member from the bill
  const removeMember = (index) => {
    setCurrentBill(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index)
    }))
  }

  // Calculate equal split among all members
  const calculateEqualSplit = () => {
    if (currentBill.members.length === 0 || !currentBill.totalAmount) return
    
    const amountPerPerson = parseFloat(currentBill.totalAmount) / currentBill.members.length
    setCurrentBill(prev => ({
      ...prev,
      members: prev.members.map(member => ({
        ...member,
        owes: amountPerPerson
      }))
    }))
  }

  // Save the current bill (create new or update existing)
  const saveBill = () => {
    if (!currentBill.title || !currentBill.totalAmount || currentBill.members.length === 0) {
      alert('Please fill in all required fields! 📝')
      return
    }

    const billToSave = {
      ...currentBill,
      id: editingBillIndex !== null ? bills[editingBillIndex].id : Date.now(),
      totalAmount: parseFloat(currentBill.totalAmount),
      date: currentBill.date || new Date().toISOString().split('T')[0]
    }

    if (editingBillIndex !== null) {
      // Update existing bill
      setBills(prev => prev.map((bill, i) => i === editingBillIndex ? billToSave : bill))
      setEditingBillIndex(null)
    } else {
      // Add new bill
      setBills(prev => [...prev, billToSave])
    }

    // Reset form
    setCurrentBill({
      title: '',
      totalAmount: '',
      date: '',
      members: [],
      payments: []
    })
    setShowForm(false)
  }

  // Edit an existing bill
  const editBill = (index) => {
    setCurrentBill(bills[index])
    setEditingBillIndex(index)
    setShowForm(true)
  }

  // Delete a bill
  const deleteBill = (index) => {
    if (confirm('Are you sure you want to delete this bill? 🗑️')) {
      setBills(prev => prev.filter((_, i) => i !== index))
    }
  }

  // Toggle payment status for a member
  const togglePayment = (billIndex, memberIndex) => {
    setBills(prev => prev.map((bill, i) => {
      if (i === billIndex) {
        return {
          ...bill,
          members: bill.members.map((member, j) => 
            j === memberIndex ? { ...member, hasPaid: !member.hasPaid } : member
          )
        }
      }
      return bill
    }))
  }

  // Send a funny reminder to unpaid members
  const sendReminder = (bill) => {
    const unpaidMembers = bill.members.filter(member => !member.hasPaid)
    if (unpaidMembers.length === 0) {
      alert('Everyone has paid! 🎉 No reminders needed!')
      return
    }

    const reminderMessages = [
      `Hey ${unpaidMembers.map(m => m.name).join(', ')}! Your wallet is calling 📞`,
      `Pssst... ${unpaidMembers.map(m => m.name).join(', ')}! Money talks, but you're not listening! 💰`,
      `Yo ${unpaidMembers.map(m => m.name).join(', ')}! Your debt is getting lonely! 😅`,
      `Reminder: ${unpaidMembers.map(m => m.name).join(', ')} still owe money! 🍕💰`
    ]

    const randomMessage = reminderMessages[Math.floor(Math.random() * reminderMessages.length)]
    alert(randomMessage)
  }

  // Calculate who owes what to whom
  const calculateSettlements = (bill) => {
    const totalPaid = bill.members.filter(m => m.hasPaid).reduce((sum, m) => sum + m.owes, 0)
    const totalOwed = bill.members.reduce((sum, m) => sum + m.owes, 0)
    const averagePerPerson = totalOwed / bill.members.length

    const settlements = []
    const paidMembers = bill.members.filter(m => m.hasPaid)
    const unpaidMembers = bill.members.filter(m => !m.hasPaid)

    paidMembers.forEach(paid => {
      unpaidMembers.forEach(unpaid => {
        if (paid.owes > averagePerPerson && unpaid.owes > averagePerPerson) {
          const amount = Math.min(paid.owes - averagePerPerson, unpaid.owes - averagePerPerson)
          if (amount > 0) {
            settlements.push({
              from: unpaid.name,
              to: paid.name,
              amount: amount.toFixed(2)
            })
          }
        }
      })
    })

    return settlements
  }

  return (
    <div className="app">
      {/* Header with fun emoji and title */}
      <header className="header">
        <h1>🍕 SplitEase 💸</h1>
        <p>Split bills like a pro, pay like a friend! 😄</p>
      </header>

      {/* Main content area */}
      <main className="main">
        {/* Add New Bill Button */}
        {!showForm && (
          <button 
            className="add-bill-btn"
            onClick={() => setShowForm(true)}
          >
            ➕ Create New Bill
          </button>
        )}

        {/* Bill Creation/Edit Form */}
        {showForm && (
          <div className="bill-form">
            <h2>{editingBillIndex !== null ? '✏️ Edit Bill' : '📝 Create New Bill'}</h2>
            
            {/* Basic Bill Info */}
            <div className="form-group">
              <label>📋 Bill Title:</label>
              <input
                type="text"
                value={currentBill.title}
                onChange={(e) => setCurrentBill(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Pizza Night 🍕"
              />
            </div>

            <div className="form-group">
              <label>💰 Total Amount:</label>
              <input
                type="number"
                value={currentBill.totalAmount}
                onChange={(e) => setCurrentBill(prev => ({ ...prev, totalAmount: e.target.value }))}
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>📅 Date:</label>
              <input
                type="date"
                value={currentBill.date}
                onChange={(e) => setCurrentBill(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            {/* Members Section */}
            <div className="members-section">
              <h3>👥 Group Members</h3>
              
              {currentBill.members.map((member, index) => (
                <div key={member.id} className="member-row">
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateMember(index, 'name', e.target.value)}
                    placeholder="Member name"
                  />
                  <input
                    type="number"
                    value={member.owes}
                    onChange={(e) => updateMember(index, 'owes', parseFloat(e.target.value) || 0)}
                    placeholder="Amount owed"
                    step="0.01"
                  />
                  <button 
                    className="remove-btn"
                    onClick={() => removeMember(index)}
                  >
                    ❌
                  </button>
                </div>
              ))}

              <div className="member-actions">
                <button onClick={addMember}>➕ Add Member</button>
                <button onClick={calculateEqualSplit}>⚖️ Equal Split</button>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button onClick={saveBill} className="save-btn">
                💾 {editingBillIndex !== null ? 'Update Bill' : 'Save Bill'}
              </button>
              <button 
                onClick={() => {
                  setShowForm(false)
                  setEditingBillIndex(null)
                  setCurrentBill({
                    title: '',
                    totalAmount: '',
                    date: '',
                    members: [],
                    payments: []
                  })
                }}
                className="cancel-btn"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        )}

        {/* Bills List */}
        {bills.length > 0 && (
          <div className="bills-section">
            <h2>📋 Your Bills</h2>
            {bills.map((bill, billIndex) => (
              <div key={bill.id} className="bill-card">
                <div className="bill-header">
                  <h3>{bill.title}</h3>
                  <div className="bill-actions">
                    <button onClick={() => editBill(billIndex)}>✏️</button>
                    <button onClick={() => deleteBill(billIndex)}>🗑️</button>
                  </div>
                </div>
                
                <div className="bill-details">
                  <p>💰 Total: ${bill.totalAmount}</p>
                  <p>📅 Date: {bill.date}</p>
                </div>

                {/* Members and Payments */}
                <div className="members-list">
                  <h4>👥 Members:</h4>
                  {bill.members.map((member, memberIndex) => (
                    <div key={memberIndex} className={`member-item ${member.hasPaid ? 'paid' : 'unpaid'}`}>
                      <span>{member.name}</span>
                      <span>${member.owes}</span>
                      <button 
                        onClick={() => togglePayment(billIndex, memberIndex)}
                        className={`payment-btn ${member.hasPaid ? 'paid' : 'unpaid'}`}
                      >
                        {member.hasPaid ? '✅ Paid' : '❌ Unpaid'}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Settlements Summary */}
                <div className="settlements">
                  <h4>💸 Who owes what:</h4>
                  {calculateSettlements(bill).map((settlement, index) => (
                    <p key={index}>
                      {settlement.from} owes {settlement.to} ${settlement.amount}
                    </p>
                  ))}
                  {calculateSettlements(bill).length === 0 && (
                    <p>All settled up! 🎉</p>
                  )}
                </div>

                {/* Reminder Button */}
                <button 
                  onClick={() => sendReminder(bill)}
                  className="reminder-btn"
                >
                  📢 Send Funny Reminder
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {bills.length === 0 && !showForm && (
          <div className="empty-state">
            <h2>🎉 Welcome to SplitEase!</h2>
            <p>Create your first bill to get started splitting expenses with friends! 💰</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
