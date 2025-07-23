import { motion } from "framer-motion";
import React, { useState } from "react";

interface IOSDatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  label: string;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

const IOSDatePicker: React.FC<IOSDatePickerProps> = ({
  value,
  onChange,
  label,
  minDate,
  maxDate,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const newDate = new Date(e.target.value);
      onChange(newDate);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value && value) {
      const [hours, minutes] = e.target.value.split(":");
      const newDate = new Date(value);
      newDate.setHours(parseInt(hours), parseInt(minutes));
      onChange(newDate);
    }
  };

  return (
    <div className={`ios-date-picker-container ${className}`}>
      {/* iOS-style table cell */}
      <div
        className="ios-table-cell ios-date-picker-cell"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="ios-date-picker-content">
          <label className="ios-cell-label">{label}</label>
          <div className="ios-date-picker-display">
            {value ? (
              <div className="ios-date-display">
                <span className="ios-date-text">{formatDate(value)}</span>
                <span className="ios-time-text">{formatTime(value)}</span>
              </div>
            ) : (
              <span className="ios-date-placeholder">Select date and time</span>
            )}
          </div>
        </div>
        <div className="ios-chevron">
          <svg
            className={`ios-chevron-icon ${isOpen ? "rotated" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>
      </div>

      {/* iOS-style picker wheel simulation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="ios-date-picker-popup"
        >
          <div className="ios-picker-controls">
            {/* Date input */}
            <div className="ios-picker-section">
              <label className="ios-picker-label">Date</label>
              <input
                type="date"
                value={value ? value.toISOString().split("T")[0] : ""}
                onChange={handleDateChange}
                min={minDate ? minDate.toISOString().split("T")[0] : undefined}
                max={maxDate ? maxDate.toISOString().split("T")[0] : undefined}
                className="ios-native-picker"
              />
            </div>

            {/* Time input */}
            <div className="ios-picker-section">
              <label className="ios-picker-label">Time</label>
              <input
                type="time"
                value={value ? value.toTimeString().slice(0, 5) : ""}
                onChange={handleTimeChange}
                className="ios-native-picker"
              />
            </div>
          </div>

          {/* Done button */}
          <div className="ios-picker-footer">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="ios-picker-done-button"
            >
              Done
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default IOSDatePicker;
