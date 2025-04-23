import React, { useEffect, useState } from "react";
import axios from "axios";

const AccountsPage = () => {
  const [bankAccounts, setBankAccounts] = useState("");
  const [creditCards, setCreditCards] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [docId, setDocId] = useState(-1);

  const fetchData = async () => {
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
        setBankAccounts(data.bank);
        setCreditCards(data.credit);
        setCreditLimit(data.credit_limit);
        setDocId(data.id);
        console.log(data);
        console.log("Login successful:", result);
      } else {
        alert("Something went wrong! Please try again");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSetMoney = (account) => {
    setSelectedAccount(account);
    setShowAddMoneyModal(true);
  };

  const handleMoneySubmit = async () => {
    const token = localStorage.getItem("token");
    console.log(selectedAccount);
    try {
      await axios.patch(
        `https://inctra-backend-00di.onrender.com/tracker/accounts/${docId}/`,
        {
          [selectedAccount]: parseFloat(amount),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchData();
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setShowAddMoneyModal(false);
    }
  };

  return (
    <div className="main-content1">
      <div className="dashboard-header">
        <h3 style={{ color: "#ffff", paddingLeft: "30px" }}>Accounts</h3>
      </div>

      <div className="page-container" style={{ padding: "0px" }}>
        {/* Bank Accounts Section */}
        <div
          style={{
            backgroundColor: "#2D2D2D",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h4 style={{ color: "white" }}>Bank Accounts</h4>
          </div>

          <div
            style={{
              backgroundColor: "#3D3D3D",
              padding: "15px",
              borderRadius: "6px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ color: "white" }}>Bank Account</div>
              <div style={{ color: "#A0AEC0", fontSize: "0.9rem" }}>
                Balance: ${bankAccounts}
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleSetMoney("bank")}
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#48BB78",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Set Money
              </button>
            </div>
          </div>
        </div>

        {/* Credit Cards Section */}
        <div
          style={{
            backgroundColor: "#2D2D2D",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h4 style={{ color: "white" }}>Credit Cards</h4>
          </div>

          <div
            style={{
              backgroundColor: "#3D3D3D",
              padding: "15px",
              borderRadius: "6px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ color: "white" }}>Credit Card</div>
              <div style={{ color: "#A0AEC0", fontSize: "0.9rem" }}>
                Balance: ${creditCards}
                <br />
                Limit: ${creditLimit}
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleSetMoney("credit")}
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#48BB78",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Set Balance
              </button>
              <button
              onClick={() => handleSetMoney("credit_limit")} 
              style={{
                padding: "8px 15px",
                backgroundColor: "#4299E1",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Set Limit
            </button>
            </div>
          </div>
        </div>

        {/* Add Money Modal */}
        {showAddMoneyModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "#2D2D2D",
                padding: "25px",
                borderRadius: "8px",
                width: "90%",
                maxWidth: "400px",
              }}
            >
               <h3 style={{ color: "white", marginBottom: "20px" }}>
              {selectedAccount === "credit_limit" 
                ? "Set Credit Limit" 
                : "Add Money"}
            </h3>

              <div style={{ marginBottom: "15px" }}>
                <input
                  type="number"
                  placeholder="Amount"
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "#3D3D3D",
                    color: "white",
                  }}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  style={{
                    flex: 1,
                    padding: "10px",
                    backgroundColor: "#48BB78",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={handleMoneySubmit}
                >
                  Add
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: "10px",
                    backgroundColor: "#F56565",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowAddMoneyModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsPage;
