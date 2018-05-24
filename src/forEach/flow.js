// @flow

import forEach from '.'

type Item = {
  name: string
}

const check1 = () => {
  const recheck = forEach().do((item: Item) => {
    console.log(item)
  })
  // $ExpectError
  recheck("adsfsd")
  // recheck([{name: "asdfas"}])
}

const check2 = () => {
  const recheck = forEach().do((item: Item) => {
    console.log(item)
  })
  // $ExpectError
  recheck(["adsfsd"])
}

const check3 = () => {
  const recheck = forEach().do((item: Item) => {
    console.log(item)
  })
  recheck([{name: "adsfsd"}])
}

const check6 = () => {
  const recheck = forEach([], {
    do: (item: Item) => {
      console.log(item)
    }
  })
  // $ExpectError
  recheck("adsfsd")
}