//Password must contain alphabets, atleast a numeric and a special charecter
//also the length of password should be atleast 6
export function passwordValidation(password) {
  var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z]).{8,}$/;
  return re.test(password);
}

export function emailValidation(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
}

export function alphanumericValidation(string) {
  var desired = string.replace(/[^A-Z0-9]+/gi, '');
  return desired;
}
