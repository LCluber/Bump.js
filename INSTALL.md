## Bump.js project installation guide

You just cloned Bump.js : git clone https://github.com/LCluber/Bump.js.git

### Install nodejs 4 on your server :
  - Windows and OSX : **https://nodejs.org/en/**
  - Linux master race : run
    - **curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -**
    - **sudo apt-get install -y nodejs**


### Install bower :
  - Run **npm install -g bower**


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
- Run **npm install** from your project directory
- Run **bower install** from your project directory


### Workflow
  - Use **grunt --help** to see the list of tasks.
  - Run **grunt dist** to build the app in production mode.
  - Run **grunt serve** to serve files in development mode, open the website, watch for changes and start working.
  
  - You can use those commands to target specific tasks :
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
    
    
  - Set node environment if needed : 
    - Run **export NODE_ENV=development**
    - Or **export NODE_ENV=production**
