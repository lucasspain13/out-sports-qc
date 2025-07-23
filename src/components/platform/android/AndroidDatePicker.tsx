import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

interface AndroidDatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  label: string;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

const AndroidDatePicker: React.FC<AndroidDatePickerProps> = ({
  value,
  onChange,
  label,
  minDate,
  maxDate,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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
      if (value) {
        newDate.setHours(value.getHours(), value.getMinutes());
      }
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

  const displayValue = value
    ? `${formatDate(value)} at ${formatTime(value)}`
    : "";

  return (
    <div className={`android-date-picker-container ${className}`}>
      {/* Material Design Text Field */}
      <div
        className={`android-textfield ${
          focusedField === "datetime" || isOpen ? "focused" : ""
        }`}
        onClick={() => setIsOpen(true)}
      >
        <input
          type="text"
          value={displayValue}
          onFocus={() => {
            setFocusedField("datetime");
            setIsOpen(true);
          }}
          onBlur={() => setFocusedField(null)}
          className="android-textfield-input"
          readOnly
          placeholder=""
        />
        <label
          className={`android-textfield-label ${displayValue ? "filled" : ""}`}
        >
          {label}
        </label>
        <div className="android-textfield-underline" />

        {/* Calendar icon */}
        <div className="android-textfield-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
          </svg>
        </div>
      </div>

      {/* Material Design Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="android-dialog-overlay"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="android-dialog"
              onClick={e => e.stopPropagation()}
            >
              {/* Dialog Header */}
              <div className="android-dialog-header">
                <h3 className="android-dialog-title">Select Date & Time</h3>
              </div>

              {/* Dialog Content */}
              <div className="android-dialog-content">
                {/* Date Section */}
                <div className="android-picker-section">
                  <label className="android-picker-label">Date</label>
                  <input
                    type="date"
                    value={value ? value.toISOString().split("T")[0] : ""}
                    onChange={handleDateChange}
                    min={
                      minDate ? minDate.toISOString().split("T")[0] : undefined
                    }
                    max={
                      maxDate ? maxDate.toISOString().split("T")[0] : undefined
                    }
                    className="android-native-picker"
                  />
                </div>

                {/* Time Section */}
                <div className="android-picker-section">
                  <label className="android-picker-label">Time</label>
                  <input
                    type="time"
                    value={value ? value.toTimeString().slice(0, 5) : ""}
                    onChange={handleTimeChange}
                    className="android-native-picker"
                  />
                </div>

                {/* Preview */}
                {value && (
                  <div className="android-picker-preview">
                    <span className="android-preview-label">Selected:</span>
                    <span className="android-preview-value">
                      {formatDate(value)} at {formatTime(value)}
                    </span>
                  </div>
                )}
              </div>

              {/* Dialog Actions */}
              <div className="android-dialog-actions">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="android-button android-button-text"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="android-button android-button-text android-button-primary-text"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AndroidDatePicker;
