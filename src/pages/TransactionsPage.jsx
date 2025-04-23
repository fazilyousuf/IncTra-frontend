import React, { useEffect, useState } from "react";
import "../styles/TransactionPage.css";

const TransactionItem = ({ category, amount, date, transaction_type }) => (
  <div className="transaction-item">
    <div className="transaction-item-category">
      <span>{category}</span>
    </div>
    <div className="transaction-item-details">
      <div className={`transaction-amount ${amount > 0 ? "" : "expense"}`}>
        {amount}
      </div>
      <div className="transaction-meta">
        <span className="transaction-date">
          {new Date(date).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  </div>
);

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    category: "",
    amount: "",
    date: "",
    type: "income",
    accountType: "Bank Account",
  });

  const incomeCategories = [
    "Salary",
    "Investment",
    "Assets",
    "Business",
    "Others",
  ];
  const expenseCategories = [
    "Food",
    "Home",
    "Transportation",
    "Entertainment",
    "Shopping",
    "Others",
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "http://localhost:8000/tracker/transactions/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setTransactions(data);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const handleAddTransaction = async () => {
    if (
      newTransaction.category &&
      newTransaction.amount &&
      newTransaction.date &&
      newTransaction.accountType &&
      newTransaction.type
    ) {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://localhost:8000/tracker/transactions/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              category: newTransaction.category,
              amount: parseFloat(newTransaction.amount),
              date: newTransaction.date,
              transaction_type: newTransaction.type === "income" ? "IN" : "EX",
              account_type:
                newTransaction.accountType === "Bank Account"
                  ? "bank"
                  : "credit",
              description: "",
            }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          setTransactions([...transactions, data]);
          setShowAddModal(false);
          setNewTransaction({
            category: "",
            amount: "",
            date: "",
            type: "income",
            accountType: "Bank Account",
          });
        }
      } catch (error) {
        console.error("API error:", error);
      }
    }
  };

  const totalAmount = transactions.reduce((sum, transaction) => {
    return transaction.transaction_type === "IN"
      ? sum + parseFloat(transaction.amount)
      : sum - parseFloat(transaction.amount);
  }, 0);

  return (
    <div className="main-content1">
      <div className="dashboard-header">
        <h3 style={{ color: "#ffff", paddingLeft: "30px" }}>Transactions</h3>
        <div className="floating-buttons-container">
          <button
            className="floating-button add"
            onClick={() => {
              setNewTransaction({
                category: "",
                amount: "",
                date: "",
                type: "income",
                accountType: "Bank Account",
              });
              setShowAddModal(true);
            }}
          >
            <span className="floating-button-icon">+</span>
          </button>
          <button
            className="floating-button subtract"
            onClick={() => {
              setNewTransaction({
                category: "",
                amount: "",
                date: "",
                type: "expense",
                accountType: "Bank Account",
              });
              setShowAddModal(true);
            }}
          >
            <span className="floating-button-icon">-</span>
          </button>
        </div>
      </div>

      <div className="transactions-container">
        <div className="transactions-wrapper">
          <div className="transactions-header">
            <div className="transactions-title">
              <span>Transactions</span>
              <span className="transactions-count">
                ({transactions.length})
              </span>
            </div>
            <div className="total-amount">
              <span>Total:</span>
              <span
                className={`total-value ${
                  totalAmount >= 0 ? "positive" : "negative"
                }`}
              >
                ${Math.abs(totalAmount).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="transactions-list">
            {transactions.map((transaction, index) => (
              <TransactionItem
                key={index}
                category={transaction.category}
                amount={transaction.amount}
                date={transaction.date}
                transaction_type={transaction.transaction_type}
              />
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="add-modal-overlay">
          <div className="add-modal-content">
            <h3>
              Add {newTransaction.type === "income" ? "Income" : "Expense"}
            </h3>
            <div className="modal-input-group">
              <select
                className="modal-input"
                value={newTransaction.category}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    category: e.target.value,
                  })
                }
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {(newTransaction.type === "income"
                  ? incomeCategories
                  : expenseCategories
                ).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-input-group">
              <input
                type="number"
                placeholder="Amount"
                className="modal-input"
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    amount: e.target.value,
                  })
                }
                min="0"
                step="0.01"
              />
            </div>
            <div className="modal-input-group">
              <input
                type="date"
                className="modal-input"
                value={newTransaction.date}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, date: e.target.value })
                }
                required
              />
            </div>
            <div className="modal-input-group">
              <select
                className="modal-input"
                value={newTransaction.accountType}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    accountType: e.target.value,
                  })
                }
                required
              >
                <option value="Bank Account">Bank Account</option>
                <option value="Credit Card">Credit Card</option>
              </select>
            </div>
            <div className="modal-button-group">
              <button
                className="modal-button confirm"
                onClick={handleAddTransaction}
              >
                Add
              </button>
              <button
                className="modal-button cancel"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
