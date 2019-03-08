module.exports.registerValidation = (username, password) => {
  const errors = [];

  if (username === "")
    errors.push({ message: "Please Fill The Username Area" });
  if (password === "")
    errors.push({ message: "Please Fill The Password Area" });

  return errors;
};
