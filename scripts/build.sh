#!/usr/bin/env bash

SCRIPTDIR=$(dirname $0)

cd $SCRIPTDIR/..

rm -fr ./dist
mkdir -p ./dist

rm -fr ./node_modules
npm install --production
cp -r ./node_modules ./dist

cp ./.env-production ./dist/.env-production
echo "NODE_ENV=production" >> ./dist/.env-production

cp ./.env-testing ./dist/.env-testing
# For the sake of this demo, making the testing variation development (so JWT is decoded, and not verified i.e. expired jwt ok)
# echo "NODE_ENV=testing" >> ./dist/.env-testing
echo "NODE_ENV=development" >> ./dist/.env-testing

echo
echo
echo

echo 'production .env'
cat ./dist/.env-production
echo
echo

echo 'testing .env'
cat ./dist/.env-testing

echo
echo
echo

cp -r ./data ./dist
cp -r index.js ./dist

cd ./dist

rm -f .env
mv .env-production .env
zip -r9 dist-production.zip ./* .env

rm -f .env
mv .env-testing .env
zip -r9 dist-testing.zip ./* .env

