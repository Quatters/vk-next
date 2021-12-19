import axios from 'axios';

const apiUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL
    : 'http://localhost:3001';

export async function getUsers(limit, offset, query) {
  limit = limit || 0;
  offset = offset || 0;
  query = query || '';

  const response = await axios.get(
    apiUrl +
      '/api/users' +
      '?limit=' +
      limit +
      '&offset=' +
      offset +
      '&find=' +
      query
  );
  return response;
}

export async function getUser(login, postsLimit) {
  postsLimit = postsLimit || 0;

  const response = await axios.get(
    apiUrl + '/api/users/' + login + '?limit=' + postsLimit
  );
  return response;
}

export async function changeAbout(about, login) {
  const response = await axios.put(
    apiUrl + '/api/users/' + login + '?type=about',
    { about }
  );
  return response;
}

export async function changeName(name, surname, login) {
  const response = await axios.put(
    apiUrl + '/api/users/' + login + '?type=name',
    { name, surname }
  );
  return response;
}

export async function changeAvatar(avatar, login) {
  const response = await axios.put(
    apiUrl + '/api/users/' + login + '?type=avatar',
    { avatar }
  );
  return response;
}

export async function changePassword(oldPassword, newPassword, login) {
  const response = await axios.put(
    apiUrl + '/api/users/' + login + '/?type=password',
    { oldPassword, newPassword }
  );
  return response;
}

export async function createPost(body, fromUser, toUserLogin) {
  const response = await axios.post(
    apiUrl + '/api/users/' + toUserLogin + '/posts',
    {
      name: fromUser.name,
      surname: fromUser.surname,
      avatarBase64: fromUser.avatarBase64,
      login: fromUser.login,
      body,
    }
  );
  return response;
}

export async function removePost(id, login) {
  const response = await axios.delete(
    apiUrl + '/api/users/' + login + '/posts/' + id
  );
  return response;
}

export async function signIn(login, password) {
  const response = await axios.post(apiUrl + '/api/login', {
    login,
    password,
  });
  return response;
}

export async function signUp(userInfo) {
  const response = await axios.post(apiUrl + '/api/register', {
    login: userInfo.login,
    password: userInfo.password,
    name: userInfo.name,
    surname: userInfo.surname,
  });
  return response;
}

export async function signOut() {
  const response = axios.get(apiUrl + '/api/logout');
  return response;
}
