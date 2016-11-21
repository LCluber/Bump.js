## Taipan.js project installation guide

You just cloned Taipan.js : git clone https://github.com/LCluber/Taipan.js.git

### Install nodejs 4 on your server :
  - Windows and OSX : **https://nodejs.org/en/**
  - Linux master race : run
    - **curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -**
    - **sudo apt-get install -y nodejs**


### Install ruby :
  - Windows : **http://rubyinstaller.org/downloads/**
  - OSX : already installed
  - Linux master race : run **sudo apt-get install ruby-full**


### Install sass :
  - Run **gem install sass**


### Install grunt :
  - Run **npm update -g npm** to update npm
  - Run **npm install -g grunt-cli**


### Install project dependencies
  - Run **npm install** in your project directory


### Workflow
  - Run **grunt** to build the app. Check **Gruntfile.js** to learn specific commands :
    - **grunt doc** builds the static documentation,
    - **grunt src** builds the library in the dist folder,
    - **grunt js** builds javascript for the website only,
    - **grunt css** builds CSS for the website,
    - **grunt static** builds the static version of the website,
    - **grunt zip** builds the downloadable zip.
  - Run **DEBUG=myapp:* npm start** in a new window to start Express server.
  - Go to **http://localhost:3004/** to test the app.
