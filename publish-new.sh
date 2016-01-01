#!/bin/bash

CURR_DIR="$(pwd)"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/packages/randomness
meteor publish
cd $CURR_DIR