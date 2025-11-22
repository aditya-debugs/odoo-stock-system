const Button = ({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
}) => {
  const baseStyles = {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    border: "none",
    borderRadius: "4px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: "500",
    transition: "all 0.2s",
    opacity: disabled ? 0.6 : 1,
  };

  const variants = {
    primary: {
      backgroundColor: "#007bff",
      color: "white",
    },
    secondary: {
      backgroundColor: "#6c757d",
      color: "white",
    },
  };

  const styles = { ...baseStyles, ...variants[variant] };

  return (
    <button type={type} onClick={onClick} style={styles} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
