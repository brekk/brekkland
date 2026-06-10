---
repo: brekk/study
title: Study
description: A helpful library for reusable test harnesses
version: v0.0.4
published: 01/01/2020
updated: 01/01/2020
tags:
  - library
  - testing
  - test
  - test-harness
size: 11
aliases: []
id: study
isPublished: true
hasBinary: false
hypothetical: false
---

## Example

Let's say you have an trivial example library, it has single function for its public API:

```mad
import List from "List"
import String from "String"



magicJoin :: String -> List String -> String
export magicJoin = (magic, xs) => {
  match = List.any(String.startsWith(magic), xs)
  match2 = List.any(String.endsWith(magic), xs)
  tail = match2 ? "~" : ""
  a = match ? "!" : "<"
  z = match && !match2 ? "!" : match2 ? "~" : ">"
  return a ++ String.join("|", xs) ++ z ++ tail
}
export xJoin = magicJoin("x")

```

### Default Example with Prelude's Test

In order to test this, we could define a test using Madlib's default `Test` library.

```madlib
import {test, assertEquals} from "Test"
import MyLibrary from "@/MyLibrary"
test("MyLibrary.coolJoin", () => {
  assertEquals(MyLibrary.coolJoin(["a", "b", "c"]), "<a|b|c>")
  assertEquals(MyLibrary.coolJoin(["a", "b", "cool-keith"]), "!a|b|cool>")
  return assertEquals(MyLibrary.coolJoin(["a", "b", "cool"]), "!a|b|cool!~~")
})
```

This works fine for this simple example. (In fact, there are some [[intentional issues]] with the code above, see [[the fix]] below if you want to jump ahead.)

`Study` has some opinionated approaches that help express this same problem more succinctly, especially as the complexity of our API increases.

### report

One of the primary functions that `Study` exports is `report` — it expects whatever is being tested to be a unary function which takes a list of `#[input, output]` tuples.

```madlib
report :: (a -> b) -> String -> List #[a, b] -> Wish TestResult TestResult

```

`report` takes the following arguments:

 1. `who` - A unary function that is the subject of testing
 2. `what` - Something which identifies this test
 3. `where` - A list of input -> output tuple pairs to run against the `who`

So we can take our [example](#Example) and write a test for it using `Study`, like so:

```madlib
import MyLibrary from "@/MyLibrary"
import Study from "Study"

Study.report(
  MyLibrary.xJoin,
  "xJoin",
  [
    #[String.words("a bra cadabra"), "<a|bra|cadabra>"],
    #[String.words("xavier xim xibble"), "!xavier|xim|xibble!"],
    #[String.words("six fix nix"), "<six|fix|nix~~"],
    #[String.words("a b x y z"), "!a|b|x|y|z~~"],
  ],
)
```

If this is all we're doing, `Study` offers little in comparison to the default approach. (Aside, as previously mentioned, from the fixes to the [[issues]] with the default example.)

But, if we have a few reasonable alterations to our premise, `Study` will be a lot more effective.

#### As a harness

One thing that is very useful is to define a test harness which you can reuse across different permutations.

In our simple example above, we're covering all the cases in the logic, but we're using the same test harness for each.

That's fine, but as we make things more complex, it's helpful to be able to name a partially applied morphism:

```madlib
xJoinTest = Study.report(MyLibrary.xJoin)

xJoinTest("default case, no specials", [
  #[String.words("a bra cadabra"), "<a|bra|cadabra>"],
])
xJoinTest("starts with x", [
  #[String.words("xavier xim xibble"), "!xavier|xim|xibble!"],
])
xJoinTest("ends with x", [
  #[String.words("six fix nix"), "<six|fix|nix~~"],
])
xJoinTest("starts and ends with x", [
  #[String.words("a b x y z"), "!a|b|x|y|z~~"],
])
```

Additionally, right now we're invoking our tests with an inline call to `String.words`, we can simplify our harness further:

```madlib
xJoinTest = Study.report(
  pipe(
    String.words,
    MyLibrary.xJoin
  )
)

xJoinTest("default case, no specials", [
  #["a bra cadabra", "<a|bra|cadabra>"],
])
xJoinTest("starts with x", [
  #["xavier xim xibble", "!xavier|xim|xibble!"],
])
xJoinTest("ends with x", [
  #["six fix nix", "<six|fix|nix~~"],
])
xJoinTest("starts and ends with x", [
  #["a b x y z", "!a|b|x|y|z~~"],
])
```

If you recall from our original [Example](#Example), our `xJoin` implementation is a partially applied form of `magicJoin`.

Up to now all of the examples have _conveniently_ been written for unary functions (one input, one output). Let's briefly go over how `Study` helps simplify your tests by allowing for discrete inputs as tuples.

### Multivariate functions

If you have a function that has more than a single parameter as an input, `Study` has several convenient utility functions which can afford n-tuple inputs (up to 10) to a function.

```madlib
import { caseN2, report } from "Study"

two = (a, b) => a + b

report(
  caseN2(two),
  "adding, with tuples", 
  [
    // #[ input, output ]
    #[ #[1, 2], 3 ]
  ]
)
```

Note the nested Tuple here, the `input` (`#[1, 2]`) value is being applied to `two`, so `a` is 1 and `b` is 2 in the applied call.






