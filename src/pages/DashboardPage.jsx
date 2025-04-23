import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const DashboardPage = () => {
  const [accountData, setAccountData] = useState({
    bank: 0,
    credit: 0,
    credit_limit: 0,
  });
  const [monthlyTotals, setMonthlyTotals] = useState({ income: 0, expense: 0 });
  const [totalAllocatedBudget, setTotalAllocatedBudget] = useState(0);

  useEffect(() => {
    const fetchAccountData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "https://inctra-backend-00di.onrender.com/tracker/accounts/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.length > 0) {
          setAccountData({
            bank: Number(response.data[0].bank),
            credit: Number(response.data[0].credit),
            credit_limit: Number(response.data[0].credit_limit),
          });
        }
      } catch (error) {
        console.error("Error fetching account data:", error);
      }
    };

    const fetchMonthlyData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "https://inctra-backend-00di.onrender.com/tracker/monthly-totals/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMonthlyTotals({
          income: response.data.income,
          expense: response.data.expense,
        });
      } catch (error) {
        console.error("Error fetching monthly data:", error);
      }
    };

    const fetchBudget = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "https://inctra-backend-00di.onrender.com/tracker/accounts/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.length > 0) {
          const account = response.data[0];
          const total =
            Number(account.food) +
            Number(account.entertainment) +
            Number(account.transportation) +
            Number(account.shopping) +
            Number(account.home) +
            Number(account.others);
          setTotalAllocatedBudget(total);
        }
      } catch (error) {
        console.error("Error fetching budget data:", error);
      }
    };

    fetchMonthlyData();
    fetchBudget();
    fetchAccountData();
  }, []);

  const thisMonthData = [
    { label: "Income", value: monthlyTotals.income, color: "#008000" },
    { label: "Expenses", value: monthlyTotals.expense, color: "#e53e3e" },
  ];

  const budgetData = [
    { label: "Allocated", value: totalAllocatedBudget, color: "#008000" },
    { label: "Used", value: monthlyTotals.expense, color: "#e53e3e" },
  ];

  const navigate = useNavigate();

  const handleContainerClick = (path) => {
    navigate(path);
  };
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h3
          style={{
            color: "#ffff",
            paddingLeft: "30px",
          }}
        >
          Dashboard
        </h3>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "15px",
          padding: "20px",
          marginTop: "60px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            minHeight: "180px",
            cursor: "pointer",
          }}
          onClick={() => handleContainerClick("/accounts")}
        >
          <h3 style={{ fontSize: "1.3rem", margin: "0 0 12px 0" }}>Summary</h3>
          <div
            style={{
              fontSize: "1.5rem",
              lineHeight: "1",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Balance:</span>{" "}
              <span style={{ color: "#008000" }}>
                ${(Number(accountData?.bank) || 0).toFixed(2)}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Credit cards:</span>
              <span style={{ color: "#2db5eb" }}>
                ${(Number(accountData?.credit) || 0).toFixed(2)}
              </span>
            </div>
            <div
              style={{
                fontWeight: "600",
                fontSize: "1.5rem",
                marginTop: "12px",
                paddingTop: "15px",
                borderTop: "1px solid #eee",
                textAlign: "right",
              }}
            >
              <span style={{ color: "#008000" }}>
                $
                {(
                  (Number(accountData?.bank) || 0) +
                  (Number(accountData?.credit) || 0)
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            minHeight: "180px",
            cursor: "pointer",
          }}
          onClick={() => handleContainerClick("/transactions")}
        >
          <h3
            style={{
              fontSize: "1.3rem",
              margin: "0 0 12px 0",
              textAlign: "right",
            }}
          >
            This Month
          </h3>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div style={{ width: "120px", height: "120px" }}>
              <PieChart data={thisMonthData} />
            </div>
            <div style={{ flex: 1, fontSize: "1.05rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span style={{ color: "#008000" }}>Income:</span>
                <span style={{ color: "#008000" }}>
                  ${monthlyTotals.income.toFixed(2)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#e53e3e" }}>Expenses:</span>
                <span style={{ color: "#e53e3e" }}>
                  ${monthlyTotals.expense.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            minHeight: "180px",
            cursor: "pointer",
          }}
          onClick={() => handleContainerClick("/budgets")}
        >
          <h3
            style={{
              fontSize: "1.3rem",
              margin: "0 0 12px 0",
              textAlign: "right",
            }}
          >
            Budget
          </h3>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div style={{ width: "120px", height: "120px" }}>
              <PieChart data={budgetData} />
            </div>
            <div style={{ flex: 1, fontSize: "1.05rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span style={{ color: "#008000" }}>Allocated:</span>
                <span style={{ color: "#008000" }}>
                  {" "}
                  ${totalAllocatedBudget.toFixed(2)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#e53e3e" }}>Used:</span>
                <span style={{ color: "#e53e3e" }}>
                  {" "}
                  ${monthlyTotals.expense.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            minHeight: "400px",
            gridColumn: "span 2",
            width: "100%",
            maxWidth: "650px",
            margin: "0 auto",
            cursor: "pointer",
            overflow: "hidden",
            position: "relative",
          }}
          onClick={() => handleContainerClick("/transactions")}
        >
          <BarChart />
        </div>

        <CreditCardItem
          cardName="Credit Card"
          usedAmount={
            (Number(accountData?.credit_limit) || 0) -
            (Number(accountData?.credit) || 0)
          }
          limit={Number(accountData?.credit_limit) || 0}
        />
      </div>
    </div>
  );
};

const PieChart = ({ data, width = 120, height = 120 }) => {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, content: "" });

  useEffect(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).selectAll("*").remove();
    const svg = d3
      .select(svgRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie().value((d) => d.value);
    const arc = d3
      .arc()
      .innerRadius(20)
      .outerRadius(Math.min(width, height) / 2);

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.label))
      .range(data.map((d) => d.color));

    const arcs = svg.selectAll("arc").data(pie(data)).enter().append("g");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.label))
      .on("mouseover", (event, d) => {
        setTooltip({
          visible: true,
          content: `${d.data.label}: $${d.data.value}`,
          color: d.data.color,
        });
      })
      .on("mouseout", () => setTooltip({ visible: false, content: "" }));
  }, [data, width, height]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={svgRef} />
      {tooltip.visible && (
        <div
          style={{
            position: "absolute",
            top: -30,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "white",
            padding: "5px 10px",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            color: tooltip.color,
            fontWeight: "500",
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

const BarChart = () => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "https://inctra-backend-00di.onrender.com/tracker/daily-totals/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (isMounted) {
          if (response.data?.length > 0) {
            setData(response.data);
          } else {
            setError("No data available");
          }
        }
      } catch (error) {
        if (isMounted) setError("Failed to load chart data");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted || !svgRef.current || !containerRef.current || data.length === 0) return;

    const drawChart = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const height = 300;
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };

      d3.select(svgRef.current).selectAll("*").remove();

      const svg = d3
        .select(svgRef.current)
        .append("svg")
        .attr("width", "100%")
        .attr("height", height)
        .attr("viewBox", `0 0 ${containerWidth} ${height}`)
        .attr("preserveAspectRatio", "xMinYMin meet");

      const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d.date))
        .range([margin.left, containerWidth - margin.right])
        .padding(0.2);

      const maxValue = d3.max(data, (d) => Math.max(d.income, d.expense));
      const yScale = d3
        .scaleLinear()
        .domain([0, maxValue * 1.1])
        .range([height - margin.bottom, margin.top]);

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale).ticks(5);

      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis);

      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis);

      // Grid lines
      svg
        .selectAll("yGrid")
        .data(yScale.ticks())
        .join("line")
        .attr("x1", margin.left)
        .attr("x2", containerWidth - margin.right)
        .attr("y1", (d) => yScale(d))
        .attr("y2", (d) => yScale(d))
        .attr("stroke", "#e2e8f0")
        .attr("stroke-width", 0.5);

      // Bars
      data.forEach((d) => {
        // Income bar
        svg
          .append("rect")
          .attr("x", xScale(d.date) + xScale.bandwidth() / 4)
          .attr("y", yScale(d.income))
          .attr("width", xScale.bandwidth() / 2)
          .attr("height", height - margin.bottom - yScale(d.income))
          .attr("fill", "#48bb78")
          .on("mouseover", (event) => {
            const [x, y] = d3.pointer(event);
            setTooltip({
              visible: true,
              content: `Income: $${d.income.toFixed(2)}`,
              x: x + margin.left,
              y: y - 20,
            });
          })
          .on("mouseout", () => setTooltip({ visible: false, content: "" }));

        // Expense bar
        svg
          .append("rect")
          .attr("x", xScale(d.date))
          .attr("y", yScale(d.expense))
          .attr("width", xScale.bandwidth() / 2)
          .attr("height", height - margin.bottom - yScale(d.expense))
          .attr("fill", "#e53e3e")
          .on("mouseover", (event) => {
            const [x, y] = d3.pointer(event);
            setTooltip({
              visible: true,
              content: `Expense: $${d.expense.toFixed(2)}`,
              x: x + margin.left,
              y: y - 20,
            });
          })
          .on("mouseout", () => setTooltip({ visible: false, content: "" }));
      });
    };

    drawChart();
    const resizeObserver = new ResizeObserver(drawChart);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [data, isMounted]);

  return (
    <div style={{ position: "relative" }} ref={containerRef}>
      <h3 style={{ marginBottom: "10px", color: "#2d3748" }}>Last 5 Days</h3>
      {loading ? (
        <div
          style={{
            height: 300,
            display: "grid",
            placeItems: "center",
            color: "#718096",
          }}
        >
          Loading chart data...
        </div>
      ) : error ? (
        <div
          style={{
            height: 300,
            display: "grid",
            placeItems: "center",
            color: "#e53e3e",
          }}
        >
          {error}
        </div>
      ) : data.length === 0 ? (
        <div
          style={{
            height: 300,
            display: "grid",
            placeItems: "center",
            color: "#718096",
          }}
        >
          No transactions data available
        </div>
      ) : (
        <div
          ref={svgRef}
          style={{
            width: "100%",
            overflow: "visible",
            minHeight: 300,
          }}
        />
      )}
    </div>
  );
};

const CreditCardItem = ({ cardName, usedAmount, limit }) => {
  const navigate = useNavigate();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const usagePercentage = ((usedAmount / limit) * 100).toFixed(1);

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    setTooltipPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 40,
    });
  };

  return (
    <div
      style={{
        background: "white",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        height: "150px",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        position: "relative",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onClick={() => navigate("/accounts")}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ fontSize: "1.3rem", margin: 0 }}>{cardName}</h3>
        <div
          style={{
            color: "#e53e3e",
            fontWeight: "600",
            fontSize: "1.1rem",
          }}
        >
          ${usedAmount.toFixed(2)}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          height: "6px",
          backgroundColor: "#f0f2f5",
          borderRadius: "3px",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      >
        <div
          style={{
            height: "100%",
            backgroundColor: "#e53e3e",
            borderRadius: "3px",
            width: `${usagePercentage}%`,
            transition: "width 0.3s ease",
          }}
        />

        {tooltipVisible && (
          <div
            style={{
              position: "absolute",
              background: "#2d3748",
              color: "white",
              padding: "6px 12px",
              borderRadius: "4px",
              fontSize: "0.85rem",
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              pointerEvents: "none",
              zIndex: 100,
            }}
          >
            ${usedAmount.toFixed(2)} / ${limit.toFixed(2)}
          </div>
        )}
      </div>

      <div
        style={{
          color: "#718096",
          fontSize: "0.9rem",
          textAlign: "right",
          paddingTop: "10px",
          borderTop: "1px solid #eee",
        }}
      >
        <div style={{ fontSize: "1rem" }}>{usagePercentage}% of limit used</div>
        <div
          style={{
            fontWeight: "600",
            fontSize: "1.2rem",
            marginTop: "8px",
          }}
        >
          Limit: ${limit.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
