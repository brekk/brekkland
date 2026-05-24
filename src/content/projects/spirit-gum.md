---
size: 101
repo: brekk/spirit-gum
title: spirit-gum
description: fugacious files in madlib
version: v0.2.1
isPublished: true
published: 01/01/2020
updated: 01/01/2020
tags:
  - file-transformer
  - tool
  - library
related:
  - pilcrow
  - clown-car
aliases: []
hasBinary: false
hypothetical: false
id: spirit-gum
---

`spirit-gum` is a magical file processor. It allows you to take:

 1. Some files as input
 2. Some rules about the shape of those files. These can be expectations (pass / fail), or ways of capturing data from the files (state), or transformations to perform on those files.
 3. This will produce a ConcreteFile, which represents the raw source path, the transformed set of lines (indexed by line number) and the aggregated state.
 4. Profit?

If that sounds kinda abstract, you're not wrong. 😅 Here're some things you can use `spirit-gum` for:

 - linting
 - templating
 - alternative syntaxes
 - aggregating data from across many sources

If that still sounds abstract, here are actual things that `spirit-gum` has been used for:

 - [[mad-literate]] uses it to allow for a "literate" syntax for writing Madlib from within something that feels like markdown
 - [[pilcrow]] uses it to generate and update magic comments in markdown / README files
 - [[clown-car]] uses it to generate records for usage with `party-bus` from a simpler representation
 - [[zest]] uses it to extricate type information from Madlib files
