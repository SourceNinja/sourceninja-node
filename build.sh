#!/bin/bash

cljsc src '{:optimizations :simple :pretty-print true :target :nodejs}' > lib/sourceninja.js
