#!/usr/bin/env bash

 #!/bin/bash

 function showConfirmation {
    echo "";
    read -p "🚨  Are you sure you want to deploy? Please type (y/n). " choice
    case "$choice" in
      y|Y ) askEnvironment;;
      n|N ) echo "☠️  Deployment cancelled." && exit 1;;
      * ) echo "Invalid input, please type y or n";;
    esac
}

 function askEnvironment {
    echo "❓  Do you want to deploy to staging or production?"
    read -p "   Please type (staging/production): " choice
    case "$choice" in
      staging ) deployStaging;;
      production ) deployProduction;;
      * ) echo "Invalid input, please fully type out the word staging or production";;
    esac
}

function createTag {
    date=`date +%Y-%m-%d:%H:%M:%S`;
    branch=`git rev-parse --symbolic-full-name --abbrev-ref HEAD`:
    commit=`git rev-parse --short HEAD `;
    tag="module.exports = '$branch:$commit@$date';";

    echo "📅  Tagging with version $branch:$commit@$date";

    echo $tag > './src/version.js';
}

function deployStaging {
    deploy "Staging" "/var/www/crypto-tv-staging";
}

function deployProduction {
    deploy "Production" "/var/www/crypto-tv";
}

function deploy {
    echo "🚀  $1 deployment starting...";

    createTag;

    rsync --delete --filter 'P node_modules' --stats --progress -avz build_webpack/ root@$ETH_TV_SERVER_IP:"$2";
}

# Script starts here
showConfirmation

