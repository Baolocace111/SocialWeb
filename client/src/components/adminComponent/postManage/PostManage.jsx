import { useState } from "react";
import UserTable from "./UserTable";
import "./postManage.scss";
import { useLanguage } from "../../../context/languageContext";
const PostManage = () => {
  const toDay = new Date();
  const [selectedMonth, setSelectedMonth] = useState(toDay.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(toDay.getFullYear());
  const { trl } = useLanguage();
  const months = [
    { value: 1, label: trl("January") },
    { value: 2, label: trl("February") },
    { value: 3, label: trl("March") },
    { value: 4, label: trl("April") },
    { value: 5, label: trl("May") },
    { value: 6, label: trl("June") },
    { value: 7, label: trl("July") },
    { value: 8, label: trl("August") },
    { value: 9, label: trl("September") },
    { value: 10, label: trl("October") },
    { value: 11, label: trl("November") },
    { value: 12, label: trl("December") },
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
    <div className="post_manage">
      <div className="dropdown-container">
        <label htmlFor="month-select">{trl("Select Month")}:</label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          <option value="">-- {trl("Select Month")} --</option>
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>

      <div className="dropdown-container">
        <label htmlFor="year-select">{trl("Select Year")}:</label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={handleYearChange}
        >
          <option value="">-- {trl("Select Year")} --</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <p>
        {trl("You selected")}:{" "}
        {selectedMonth && selectedYear
          ? `${getMonthLabel(selectedMonth)} ${selectedYear}`
          : trl("Please select month and year")}
      </p>
      {selectedMonth && selectedYear && (
        <UserTable year={selectedYear} month={selectedMonth} />
      )}
    </div>
  );
};
export default PostManage;
