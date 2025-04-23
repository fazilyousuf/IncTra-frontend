import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/BudgetPage.css";

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState({
    food: 0,
    entertainment: 0,
    transportation: 0,
    health: 0,
    shopping: 0,
    home: 0,
    others: 0,
  });
  const [total, setTotal] = useState(0);
  const [budgetId, setBudgetId] = useState(-1);

  useEffect(() => {
    fetchBudgets();
  }, []);

  useEffect(() => {
    console.log(budgetId);
  }, [budgetId]);

  const fetchBudgets = async () => {
    const Accesstoken = localStorage.getItem("token");
    try {
      const response = await fetch("https://inctra-backend-00di.onrender.com/tracker/accounts/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Accesstoken}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const data = result[0];
        setBudgetId(data.id);
        setBudgets({
          food: data.food,
          entertainment: data.entertainment,
          transportation: data.transportation,
          shopping: data.shopping,
          home: data.home,
          others: data.others,
        });
        const total =
          Number(data.food) +
          Number(data.entertainment) +
          Number(data.transportation) +
          Number(data.shopping) +
          Number(data.home) +
          Number(data.others);
          setTotal(total)
      } else {
        alert("Something went wrong! Please try again");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const calculateTotal = (budgets) => {
    const sum = budgets.reduce(
      (acc, curr) => acc + Number(curr.allocated_amount || 0),
      0
    );
    setTotal(sum);
  };

  const handleAllocation = async (category, amount) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://inctra-backend-00di.onrender.com/tracker/accounts/${budgetId}/`,
        {
          [category]: parseFloat(amount),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchBudgets();
    } catch (error) {
      console.error("Error setting budget:", error);
    }
  };

  return (
    <div className="dashboard-header">
      <h3 style={{ color: "#ffff", paddingLeft: "30px" }}>Budgets</h3>
      <div className="budgets-container">
        {Object.entries(budgets).map(([category, allocated]) => (
          <BudgetItem
            key={category}
            category={category}
            allocated={allocated}
            onSet={handleAllocation}
          />
        ))}
        <div className="budget-total">
          <span>Total Allocated</span>
          <span>${Number(total || 0).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

const BudgetItem = ({ category, allocated, onSet }) => {
  const [amount, setAmount] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount) {
      onSet(category, amount);
      setAmount("");
      setShowForm(false);
    }
  };

  return (
    <div className="budget-item">
      <span className="category-name">{category}</span>
      <span className="allocated-amount">
        ${Number(allocated || 0).toFixed(2)}
      </span>
      {!showForm ? (
        <button className="toggle-button" onClick={() => setShowForm(true)}>
          Set
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="allocation-form">
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            autoFocus
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default BudgetsPage;
