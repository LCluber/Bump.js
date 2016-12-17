## Bump.js project installation guide

You just cloned Bump.js : git clone https://github.com/LCluber/Bump.js.git

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
  - Run **grunt** to build the app. 
  - Run **grunt serve** to serve files, launch the website, watch for changes and start working.
  
  - You can use those commands if you don't like grunt-watch :
    - **grunt doc** builds the static documentation,
    - **grunt src** builds the library in the dist folder,
    - **grunt js** builds javascript for the website,
    - **grunt css** builds CSS for the website,
    - **grunt static** builds the static version of the website,
    - **grunt zip** builds the downloadable zip.
    - **grunt watch** builds the library automatically on files modifications.
    - Start Express server :
      - Windows : Run **set DEBUG=Bumpjs:* & npm start**
      - Linux / OSX : Run **DEBUG=Bumpjs:* npm start**
    - Go to **http://localhost:3006/** to test the app.
    - Keep in mind running **grunt serve** once will do all this automatically.
