#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run docs:build

# navigate into the build output directory
cd dist

#将一个目录下的一些文件移动到另一个目录下
cp -R * ../kigane.github.io

cd ../kigane.github.io

git add -A
git commit -m 'deploy'
git push

cd -

read -n 1 -p 'Press any key to continue...'
# exec /bin/bash