#!/bin/bash

cljsc src/sourceninja/core.cljs '{:optimizations :simple :pretty-print true :target :nodejs}' > lib/sourceninja/core.js
