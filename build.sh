#!/bin/bash

cljsc src '{:optimizations :simple :pretty-print true}' > lib/sourceninja.js
