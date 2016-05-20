Design-en-Recherche
===================
Source code of the website http://www.designenrecherche.org/.

It uses node+express for backend and angular+d3 for front-end.

Data is stored and fetched from Google Drive.

Logo design by Thiago Maximo and Robin de Mourat.
Website design by Max Mollon and Robin de Mourat.


# Howto

## Requirements

* install [node and npm](https://nodejs.org/en/)
* install [yeoman](http://yeoman.io/) - npm install -g yo

Or if you don't want to install yeoman :
* install [Grunt](http://gruntjs.com/) - npm install -g grunt-cli
* install [bower](http://bower.io/) - npm install -g bower

## Installation

Download and unpack the repo, open a terminal and cd to its root directory, then :
```
npm install
bower install
```

## Usage

Development :
```
grunt serve
```

Production :
```
grunt build
cd dist
```


## Test

Run all tests :

```
grunt test
```

Run only front-end tests : 

```
grunt mocha
```
