# VK Next

VK Next is an attempt to build a social network website like [vk.com](https://vk.com). Currently it allows you to

- Register and create a personal page
- Authorize using login and password
- Change your personal page: status, name and surname, password, upload an avatar
- Search for users and check their pages
- Create a post on your wall or any other user's wall, remove posts from your wall

The next step is implementing messenger.

This app is a Single Page Application (SPA). Under the hood it uses Express.js, React and MongoDB. You could check working app [here](http://132.226.9.12).

# Running in your environment

## Prerequisites

To run VK Next you have to install **_Node.js_** (tested on v16.13.x) and **_NPM_** (tested on v8.1.x). See https://nodejs.org/en/download.

Also, app uses **_MongoDB_** so make sure you have installed it too (see https://www.mongodb.com/try/download/community).

To host the app we used **nginx** as a reverse proxy server (see https://nginx.org).

## Installation

1. Clone repo:

```text
git clone https://github.com/Quatters/vk-next.git
```

2. For each of **_api_** and **_client_** directories install node packages, i.e.

```bash
cd api
npm install
cd ../client
npm install
```

3. Next, create an **_.env_** file in the root of **_api_** directory. Here you have to provide a `SECRET` that used for authorization. It can be any string value, e.g.

```text
SECRET=my_secret_value
```

Here you are able to run a dev server.

4. Provide a `SERVER_NAME` value in the **_.env_** file of **_api_** directory, e.g.

```text
SERVER_NAME=https://example.com
or
SERVER_NAME=http://123.123.123.123
```

5. Create another **_.env_** file in the root of **_client_** directory and provide `REACT_APP_API_URL` value that matches `SERVER_NAME` from previous step.

Here you are able to build app for production.

## Running dev server

API runs on port 3001, to start a dev server, use `npm run dev` in the **_api_** directory.

Client dev server runs on port 3000, to start use `npm start` in the **_client_** directory.

Both of them support hot reload.

## Production build

Build React app with `npm run build` command. Move generated files from **_client/build_** to **_api/client_**. Start API with `npm start` command.

To use nginx as a reverse proxy server you could use following config:

```text
server {
        listen 80;

        server_name <your server name>;

        location / {
                proxy_pass http://localhost:3001;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
    }
}
```
