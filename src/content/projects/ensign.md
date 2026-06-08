---
dependencies:
  - pilcrow
  - orthography
  - Study
  - PartyBus
repo: brekk/ensign
title: ensign
description: Handle argument parsing for command-line interfaces in Madlib
version: v0.1.0
isPublished: true
related:
  - rage
published: 01/01/2020
updated: 01/01/2020
tags:
  - library
  - command-line-interface
  - cli
aliases: []
id: ensign
size: 83
hasBinary: false
hypothetical: false
---

## Example

Let's start with a hypothetical pizza order tool.

### Program domain

Firstly, let's define the flags that we expect the users to be able to provide:

- Name for the order
- Sauce base for the pizza (Default: "red sauce")
- Cheese for the pizza (Default: "mozzarella")
- Topping(s)
- Pizza size

### Defining flags

Here's the same context written as `ensign` flags:

```mad
import { flagString, flagBoolean } from "ensign/Declared/Flags"
PIZZA_FLAGS = [
  flagString("name", ["n"], "Name for the order"),
  flagBoolean("gluten-free", ["gf"], "Make this gluten free!"),
  flagString("base", ["b"], "What sauce base should we use?"),
  flagString("cheese", ["c"], "What cheese should we use?"),
  flagString("topping", ["t"], "What topping(s) do you want?"),
  flagString("size", ["s"], "What size pizza should this be?"),
]
```

This gives us a basis for validating whether what our user gave us is correct and interpretable.

#### Adding Help

Let's also add a `--help` / `-h` flag to our `PIZZA_FLAGS` list to give our users a better experience if they make a mistake or don't know the expected flags:

```mad
flagBoolean("help", ["h"], "The flags for making a pizza")
```

`ensign` ships with a `helpWithColor` function that will format the above list as printed help text (we are excluding handling a `--color` flag in this example for brevity, so we can just pass `false` here. A later article will explain that additional UX consideration):

```mad
import Ensign from "ensign"
IO.trace("HELP", Ensign.helpWithColor(false, PIZZA_FLAGS))
```

This will print:

```
HELP
--help / -h
  boolean
  Display help text

--name / -n
  string
  Name for the order

--gluten-free / --gf
  boolean
  Make this gluten free!

--base / -b
  string
  What sauce base should we use?

--cheese / -c
  string
  What cheese should we use?

--topping / -t
  string
  What topping(s) do you want?

--size / -s
  string
  What size pizza should this be?
```

### Defining state

So now that we've [[ensign#Defining flags|defined our flags]], we want to define a program state. (This is different from the flags in that there's not necessarily a 1:1 of the CLI inputs to the state.)

```mad
import type { Maybe } from "Maybe"

alias PizzaOrder = {
  base :: Maybe String,
  cheese :: Maybe String,
  help :: Boolean,
  isGlutenFree :: Boolean,
  name :: Maybe String,
  size :: Maybe Integer,
  toppings :: List String,
}
```

As you can see, here we've defined these as `Maybe` values, so we can handle them being optional. However, if you want a less flexible / more strict solution, this might not be what you want.

Now that we've defined the `type` (or in this case, the `alias` / Record), we can define an initial state of that type:

```mad
INITIAL_STATE :: PizzaOrder
INITIAL_STATE = {
  help: false,
  name: Nothing,
  isGlutenFree: false,
  base: Just("red sauce"),
  cheese: Just("mozzarella"),
  toppings: [],
  size: Just(3),
}
```

### Applying arguments to state

Now we need to combine the defined flags with our program state, so that the user's input can be applied to state. We'll go a step at a time here.

Firstly, let's define what to do per flag, given the current order:

```mad
captureTheFlag :: PizzaOrder -> Flag -> #[Boolean, PizzaOrder]
captureTheFlag = (state, flag) => where(flag) {
  Flag(k, v) =>
    if (k == "name") {
      #[false, { ...state, name: Just(v) }]
    } else if (k == "base") {
      #[false, { ...state, base: Just(v) }]
    } else if (k == "cheese") {
      #[false, { ...state, base: Just(v) }]
    } else if (k == "topping") {
      #[false, { ...state, toppings: [...state.toppings, v] }]
    } else if (k == "size") {
      #[false, { ...state, size: scan(v) }]
    } else {
      #[false, state]
    }

  FlagToggle(k, v) =>
    if (k == "help") {
      // exclusive / short-circuiting
      #[true, { ...state, help: v }]
    } else if (k == "gluten-free") {
      #[false, { ...state, isGlutenFree: v }]
    } else {
      #[false, state]
    }

  _ =>
    #[false, state]
}
```

We're returning `#[Boolean, PizzaOrder]` here so that we can short-circuit if we want to stop processing flags for whatever reason.
For this example the only reason that might happen is when the user provides `--help`, but in a real example you might run into invalid inputs or have some state that cannot be processed.

### Folding / aggregating state

The pure [[ensign#Applying arguments to state|application transformer]] has now been defined, but for it to be useful we need to aggregate each flag into one application state.

Here's a recursive function which takes an order, a processing function, and our list of flags. You can see that the `process` argument matches our `captureTheFlag` type definition.

```mad
processFlagState :: PizzaOrder
  -> (PizzaOrder -> Flag -> #[Boolean, PizzaOrder])
  -> List Flag
  -> PizzaOrder
processFlagState = (state, process, flags) => {
  walker = (done, aggState, toProcess) => if (done) {
    aggState
  } else {
    where(toProcess) {
      [] =>
        aggState

      [a, ...z] =>
        where(process(aggState, a)) {
          #[stop, upState] =>
            walker(stop, upState, z)
        }
    }
  }
  return walker(false, state, flags)
}
```

That short-circuiting behavior takes effect here, the `done` value is the first value in the `#[Boolean, State]` tuple from the `captureTheFlag` output.

### Putting it all together

Ok, now we can connect all of this together in a runnable example.

```mad
main = (args) => {
  pipe(
    /* drop the first value, that's the name of this file */
    List.drop(1),
    IO.pTrace("hi, whaddaya want?"),
    /* given the flags we wanna match against, compare them to the given arguments */
    Ensign.readArgs(PIZZA_FLAGS),
    IO.pTrace("lemme read that back"),
    /* fold over our flags to build an initial state */
    map(processFlagState(INITIAL_STATE, captureTheFlag)),
    /* if help has been invoked, move that to the left hand branch */
    chain((x) => x.help ? Either.Left(Ensign.helpWithColor(false, PIZZA_FLAGS)) : Either.Right(x)),
    IO.pTrace("order up"),
    /* we can jump back out of Either if we want, */
    /* by rolling back to the previous state as a fallback */
    // Either.fromRight(INITIAL_STATE),
    bimap(IO.putLine, IO.pTrace("Final output")),
  )(args)
}
```

Hooray! Now we have a command-line program that can be run directly with `madlib run` via the `--` passthrough:

```shell
madlib run src/Main.mad -- --name Pizzapants -t pepperoni -s 4 -t corn -t habanero
```

Will print a final output:

```
{
  base: Just("red sauce"),
  cheese: Just("mozzarella"),
  help: false,
  isGlutenFree: false,
  name: Just("Pizzapants"),
  size: Just(4),
  toppings: ["pepperoni", "corn", "habanero"]
}
```

And if you pass something invalid, you can see how we are able to recover because it's an Either:

```sh
madlib run src/Main.mad -- --name Pizzapants -x garlic
```

```
Errors during parsing.
        Unexpected flag x.
```

Here's everything above written as a single block of text:

<details>
<summary>Show full example</summary>
<code>

    import type { Maybe } from "Maybe"

    import type { Flag } from "@/Flags"

    import Either from "Either"
    import IO from "IO"
    import List from "List"
    import { Just, Nothing } from "Maybe"

    import { flagBoolean, flagString } from "@/Declared/Flags"
    import Ensign from "@/Ensign"
    import { Flag, FlagToggle } from "@/Flags"



    PIZZA_FLAGS = [
      flagBoolean("help", ["h"], "Display help text"),
      flagString("name", ["n"], "Name for the order"),
      flagBoolean("gluten-free", ["gf"], "Make this gluten free!"),
      flagString("base", ["b"], "What sauce base should we use?"),
      flagString("cheese", ["c"], "What cheese should we use?"),
      flagString("topping", ["t"], "What topping(s) do you want?"),
      flagString("size", ["s"], "What size pizza should this be?"),
    ]

    alias PizzaOrder = {
      base :: Maybe String,
      cheese :: Maybe String,
      help :: Boolean,
      isGlutenFree :: Boolean,
      name :: Maybe String,
      size :: Maybe Integer,
      toppings :: List String,
    }
    INITIAL_STATE :: PizzaOrder
    INITIAL_STATE = {
      help: false,
      name: Nothing,
      isGlutenFree: false,
      base: Just("red sauce"),
      cheese: Just("mozzarella"),
      toppings: [],
      size: Just(3),
    }


    captureTheFlag :: PizzaOrder -> Flag -> #[Boolean, PizzaOrder]
    captureTheFlag = (state, flag) => where(flag) {
      Flag(k, v) =>
        if (k == "name") {
          #[false, { ...state, name: Just(v) }]
        } else if (k == "base") {
          #[false, { ...state, base: Just(v) }]
        } else if (k == "cheese") {
          #[false, { ...state, base: Just(v) }]
        } else if (k == "topping") {
          #[false, { ...state, toppings: [...state.toppings, v] }]
        } else if (k == "size") {
          #[false, { ...state, size: scan(v) }]
        } else {
          #[false, state]
        }

      FlagToggle(k, v) =>
        if (k == "help") {
          // exclusive / short-circuiting
          #[true, { ...state, help: v }]
        } else if (k == "gluten-free") {
          #[false, { ...state, isGlutenFree: v }]
        } else {
          #[false, state]
        }

      _ =>
        #[false, state]
    }

    processFlagState :: PizzaOrder
      -> (PizzaOrder -> Flag -> #[Boolean, PizzaOrder])
      -> List Flag
      -> PizzaOrder
    processFlagState = (state, process, flags) => {
      walker = (done, aggState, toProcess) => if (done) {
        aggState
      } else {
        where(toProcess) {
          [] =>
            aggState

          [a, ...z] =>
            where(process(aggState, a)) {
              #[stop, upState] =>
                walker(stop, upState, z)
            }
        }
      }
      return walker(false, state, flags)
    }

    main = (args) => {
      pipe(
        /* drop the first value, that's the name of this file */
        List.drop(1),
        IO.pTrace("hi, whaddaya want?"),
        /* given the flags we wanna match against, compare them to the given arguments */
        Ensign.readArgs(PIZZA_FLAGS),
        IO.pTrace("lemme read that back"),
        /* fold over our flags to build an initial state */
        map(processFlagState(INITIAL_STATE, captureTheFlag)),
        chain((x) => x.help ? Either.Left(Ensign.helpWithColor(false, PIZZA_FLAGS)) : Either.Right(x)),
        IO.pTrace("order up"),
        /* we can jump back out of Either if we want, */
        /* by rolling back to the previous state as a fallback */
        // Either.fromRight(INITIAL_STATE),
        bimap(IO.putLine, IO.pTrace("Final output")),
      )(args)
    }

    /*
    // valid input
    madlib run src/Main.mad -- --name Pizzapants -t pepperoni -s 4 -t corn -t habanero --no-gf
    // invalid input
    madlib run src/Main.mad -- --name Madness -t pepperoni -s xl --hey there

</code>
</details>
