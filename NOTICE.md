## Bump.js project installation guide

You just cloned Bump.js : git clone https://github.com/LCluber/Bump.js.git

### Install nodejs on your server :
  - Windows and OSX : **https://nodejs.org/en/**
  - Linux master race : run
    - **curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -**
    - **sudo apt-get install -y nodejs**


### Install grunt :
  - Run **npm update -g npm** to update npm
  - Run **npm install -g grunt-cli**


### Install typescript :
  - Run **npm install -g typescript**


### Install project dependencies
  - Run **npm install** from your project directory
  - Run **bower install** from your project directory


### Workflow
  - Run **grunt** to serve the website. (http://localhost:3000/)
  - Run **grunt build** to build the library and serve the website.
  - Use **grunt --help** to see the list of tasks.

  - Set node environment if needed :
    - Run **export NODE_ENV=development**
    - Or **export NODE_ENV=production**
