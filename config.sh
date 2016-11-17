#!/bin/bash

curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install gulp --save-dev
npm install browser-sync --save-dev
