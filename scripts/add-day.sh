#!/usr/bin/env bash

input=src/$1/input/$2.txt
solver=src/$1/$2.ts

touch "$input" "$solver"
