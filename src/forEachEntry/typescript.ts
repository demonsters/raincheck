// @flow

import forEachEntry from '.'

type Item = {
  name: string
}

const checkWithoutArguments = () => {
  const recheck = forEachEntry().do((item: Item) => console.log(item.name))
  recheck({item1: {name: "s"}})
}

const checkWithMapValue = () => {
  const value = {item1: {name: "s"}}
  const recheck = forEachEntry((s: typeof value) => s)
    .do((item: Item) => console.log(item.name))

  recheck(value)

  // @ts-ignore: should fail!
  recheck({item1: "s"})
}
