export const emailPattern = {
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message: "Invalid email address",
};

export const passwordPattern = {
  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  message:
    "Password must contain at least 8 characters, one uppercase, one lowercase, and one number",
};

export const namePattern = {
  value: /^[a-zA-Z\s]+$/,
  message: "Name must contain only letters and spaces",
};
