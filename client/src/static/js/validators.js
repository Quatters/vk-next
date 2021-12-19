export function nameIsCorrect(name) {
  return name.length > 0 && /^[a-zа-я-]+$/i.test(name);
}

export function loginIsCorrect(login) {
  return login.length >= 4 && /^[a-z0-9-]+$/i.test(login);
}

export function passwordIsCorrect(password) {
  return password.length >= 4;
}
