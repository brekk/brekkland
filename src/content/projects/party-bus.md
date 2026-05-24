---
size: 121
repo: brekk/party-bus
title: PartyBus
description: Conditional and contextual logging for Madlib
version: v0.0.8
isPublished: true
published: 01/01/2020
updated: 01/01/2020
tags:
  - library
  - event
  - logging
aliases: []
hasBinary: false
hypothetical: false
id: party-bus
---

PartyBus is a helpful library which affords conditional, filterable and contextual logging. Much like `IO.pTrace`, it is designed to be a binary function that helps annotate an existing value as it passes through the `pipe`. It also supports a `tap` function which allows you to manipulate the shape of the value being logged without changing the underlying value. It is based upon the prior art of the `debug` node module as well as `envtrace` (which similarly helped inform the existing `IO.pTrace` pattern that Madlib uses today). PartyBus is significantly easier to use after `madlib@0.25.0` and up, as it relies upon `Show` constraints.

---

###### Features

- Structured logging
- Event system

PartyBus is designed to be a near drop-in replacement for `IO.pTrace`. It affords conditional logging, log transformers, and color!
