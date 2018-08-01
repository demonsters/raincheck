// @flow

import forEach from '.'

type Item = {
  name: string
}

const checkWithoudArgument = () => {
  const recheck = forEach().do((item: Item) => {
    console.log(item)
  })
  // @ts-ignore: Should fail
  recheck("adsfsd")

  // @ts-ignore: Should fail
  recheck(["adsfsd"])

  recheck([{name: "adsfsd"}])
}

const checkWithMapValue = () => {
  const recheck = forEach((items: Array<Item>) => items, {
    do: (item: Item) => {
      console.log(item)
    }
  })
  
  // @ts-ignore: Should fail
  recheck("adsfsd")

  // @ts-ignore: Should fail
  recheck(["adsfsd"])

  recheck([{name: "adsfsd"}])
}