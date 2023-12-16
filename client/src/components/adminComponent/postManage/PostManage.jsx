import { useState } from "react";
import UserTable from "./UserTable";
const PostManage = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [isLoading, setIsLoading] = useState("false");
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Tạo danh sách năm từ 1990 đến hiện tại
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 1990; year <= currentYear; year++) {
    years.push(year);
  }

  const handleMonthChange = (e) => {
    setSelectedMonth(Number(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };

  const getMonthLabel = (value) => {
    const month = months.find((m) => m.value === value);
    return month ? month.label : "";
  };
  return (
    <div>
      <label>Select Month:</label>
      <select value={selectedMonth} onChange={handleMonthChange}>
        <option value="">-- Select Month --</option>
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>

      <label>Select Year:</label>
      <select value={selectedYear} onChange={handleYearChange}>
        <option value="">-- Select Year --</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <p>
        You selected:{" "}
        {selectedMonth && selectedYear
          ? `${getMonthLabel(selectedMonth)} ${selectedYear}`
          : "Please select month and year"}
      </p>
      {selectedMonth && selectedYear && (
        <UserTable year={selectedYear} month={selectedMonth}></UserTable>
      )}
    </div>
  );
};
export default PostManage;
