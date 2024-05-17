export const ValidateInputs = (...inputs) => {
  return new Promise((resolve, reject) => {
    // Kiểm tra tất cả các biến trong mảng inputs
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      // Kiểm tra xem biến có là undefined hoặc trống không
      if (input === undefined || input === "") {
        return reject("Value is null"); // Trả về false nếu có bất kỳ biến nào trống hoặc undefined
      }
      // Kiểm tra xem có ký tự đặc biệt nào không hợp lệ không
      const regex = /^[a-zA-Z0-9_ ]*$/; // Regex chỉ cho phép chữ cái, số, dấu cách và dấu gạch dưới
      if (!regex.test(input)) {
        return reject(`${input} is invalid`); // Trả về false nếu có ký tự không hợp lệ
      }
    }
    return resolve(true); // Trả về true nếu tất cả các điều kiện đều thoả mãn
  });
};
export const ValidateInputAllowNull = (...inputs) => {
  return new Promise((resolve, reject) => {
    // Kiểm tra tất cả các biến trong mảng inputs
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      // Kiểm tra xem biến có là undefined hoặc trống không

      // Kiểm tra xem có ký tự đặc biệt nào không hợp lệ không
      const regex = /^[a-zA-Z0-9_ ]*$/; // Regex chỉ cho phép chữ cái, số, dấu cách và dấu gạch dưới
      if (!regex.test(input)) {
        return reject(`Value ${i + 1} is invalid`); // Trả về false nếu có ký tự không hợp lệ
      }
    }
    return resolve(true); // Trả về true nếu tất cả các điều kiện đều thoả mãn
  });
};
