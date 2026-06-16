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

This works fine for this simple example. (In fact, there are some [intentional issues](#Shortcomings%20of%20the%20default%20Test%20module) with the code above, see the explanation below for more context)

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


## Shortcomings of the default Test module

In the original [[#example]] we briefly mentioned that there are intentional errors in the example. 

### Without do notation, failures are silent 

As written: failures in assertions fail silently unless they are the assertion returned.

This will pass:

```madlib
test("this will pass", () => {
  assertEquals(true, false) // <~~ not returned, thrown away
  assertEquals(1, 200)
  return assertEquals(true, true)
})
```

In order to fix this, we have to rewrite the function to use `do` notation. 

```madlib
test("this will correctly catch the failure", () => do {
  _ <- assertEquals(true, false) // <~~ correctly fails 
  _ <- assertEquals(1, 200)
  return assertEquals(true, true)
})
```

But that's easy to forget to do, and that syntax (executing the `assertEquals` function and assigning it to an empty / gap assignment) is likely confusing to newcomers.

### Errors fail the entire sequence

Another issue with the default `test` example is that if you have a failure in a test function, even a proper `do` notation style function, a failure will prevent further execution of the function. This makes sense and is very rational for how Madlib works. However, as a tester, optimizing for transparency across the entire suite is most of the workflow. If you have a test that appears to fail catastrophically, but in actuality has one failing assertion and several assertions that never run, it feels scarier. A lot of what we want to optimize for in Madlib is developer confidence, both in how the system works and how the system fails.

```madlib
test(
  "this has multiple failures, but only one will win",
  () => do {
    _ <- assertEquals(true, true)
    _ <- assertEquals(1, 100) // <~~ this wins
    _ <- assertEquals(true, true)
    return assertEquals(true, false) // <~~ this never runs
  },
)
```

The only way we can fix this (and truly, the same mechanism by which `Study` does it) is to move each assertion to its own `test` function. An example of this is left to the reader. 😁

### Assertions are expressions

This isn't an issue per se, but one of the things that we strive for in most of Madlib is being a language of functions. A knock-on effect of the `do` notation function approach is that it reduces the utility of the binary function `assertEquals` back to an expression (and, a non-unary function is harder to compose). We can assign it to something, but relative to how it functions, it doesn't really make sense to do so. This means that we have to wade through the rest of the test when something fails, because currently the test runner only captures the failure site. Again, not really a shortcoming of the testing design, but more the effect of running an assertion within a Wish / Monad.

`Study` aims to fix this by making the core transformation very explicit `#[input, output]` pairs. There's no additional syntactic noise (other than the tuple wrapping), so that you can focus on the assertions themselves.

### Test functions are opaque

Test functions are nullary. That means that anything we're manipulating within those functions has to be managed independently / kept in global space. But this runs into issues because tests are run in isolation. (The running in isolation is part of the reasoning / rationale behind the nullary function approach, so it's unfair to frame it as a problem that the default testing approach has, it's just a specific trade-off)

`Study` doesn't necessarily address this problem directly, but it makes it so that the test surface is much more transparent. You can convert a test from a nullary function associated to a string label to more repeatable test expressions that have clear edges.

The default `test` cannot take advantage of the natural currying that `Study` utilizes, and we can define natural domains for our tests.

If I have a test that I know I want to run several tests upon, especially in different groups, I can define a partially-applied `report`:

```madlib
testMyFunction = Study.report(myFunction)
```

Now I can reuse this instance across different slices:

```madlib
testMyFunction("myFunction returns zero in the default case", [#[100, 0]])
testMyFunction("myFunction returns negative values when out of bounds", [#[-300, -1]])
```

Because we have a list of tuples as our final input, `report` is designed for multiple cases and is easy to manipulate. We've all had tests where we just need to add a single case and we don't want to understand all the context of the existing test harness. We can use composition to aid us in expressing tests simply and declaratively and define our testing harness _using_ the very functions which we are testing as an input; this allows us to manipulate tests much more naturally.

```madlib
Study.report(
  pipe(
    simplifyTestHarnessFixture,
    myFunction 
  ),
  "my important test with harness fixture",
  MY_TEST_CASES_WITH_FIXTURE
)
```



