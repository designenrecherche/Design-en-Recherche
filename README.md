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

### Google Drive API connection

The website uses google drive as a data source. Textual contents (spreadsheets and pages) are fetched thanks to the "publish to the web" functionality in google apps.

Static assets (images, pdfs, videos, ...) are fetched through Google Drive API v3 and stored as static assets on the server (refreshed each time data is refreshed).

Google Drive API connection is provided by a service account allowing to perform server-to-server interactions. The credentials relative to this service account are provided by a ``key.json`` file located in ``server/config``.

Please refer to [Google's guide](https://developers.google.com/identity/protocols/OAuth2ServiceAccount) if you plan to change the service account responsible for static files access. You will have to create a new service account, grant it with G Suite domain-wide access, and download a new secret key in json format.

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
