// @flow

import forEachEntry from '.'

type Item = {
  name: string
}

const check1 = () => {
  const recheck = forEachEntry().do((item: Item) => console.log(item.name))
  recheck({item1: {name: "s"}})
}

const check2 = () => {
  const recheck = forEachEntry({item1: {name: "s"}})
    .do((item: Item) => console.log(item.name))

  recheck({item1: {name: "s"}})
}

const check3 = () => {
  const recheck = forEachEntry({item1: {name: "s"}})
    .do((item: Item) => console.log(item.name))

  recheck({item1: {name: "s"}})
}

const check4 = () => {
  const recheck = forEachEntry({item1: {name: "s"}})
    .do((item: Item) => console.log(item.name))
  
  // $ExpectError: should fail, but flow can't distinguish between an object an a function 
  recheck({item1: "s"})
}
