import { curry, path, mergeDeepRight, pipe, curryN } from "ramda"
import type { BlemModifier, BlemInstance } from "#/utilities/blem"
import blem from "#/utilities/blem"
import { createElement } from "react"

export function eventValue<T = HTMLInputElement>(
  e: React.ChangeEvent<T>,
): string {
  return path(["target", "value"], e!) as string
}

// curried React.createElement, with no optional types
export const el = curryN(2, function _component(con, props) {
  return createElement(con, props, props?.children ?? [])
})

// React.createElement with defaults
export const elDef = curryN(3, function _componentWithDefs(def, con, props) {
  return pipe(mergeDeepRight(def), el(con))(props)
})

export type BemProps = (
  rawProps: Record<string, any>,
) => Partial<{ className: string }>

export const bemifyProps = curry(
  (
    bem: BlemInstance,
    rawProps: Record<string, any>,
  ): Partial<{ className: string }> => {
    const { e = "", m = [], ...props } = rawProps
    return { className: bem(e, m), ...props }
  },
)

export const blemEl = pipe(
  blem,
  (bem) =>
    (con: unknown, props: Record<string, unknown>): BemProps =>
      el(con, bemifyProps(bem)(props)),
)
