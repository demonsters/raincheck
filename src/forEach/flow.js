// @flow

import forEach from '.'

type Item = {
  name: string
}

const checkNoArgument = () => {
  const recheck = forEach().do((item: Item) => {
    console.log(item)
  })

  recheck([{name: "adsfsd"}])

  // $ExpectError
  recheck("adsfsd")

  // $ExpectError
  recheck(["adsfsd"])
}

const checkMapFunction = () => {
  const recheck = forEach((s: string) => [{name: s}])
    .do((item: Item) => {
      console.log(item)
    })
    
  recheck("adsfsd")

  // $ExpectError
  recheck(["adsfsd"])
}

const checkMapAndSettings = () => {
  const recheck = forEach((s: string) => [{name: s}], {
    do:(item: Item) => {
      console.log(item)
    }
  })
    
  recheck("adsfsd")

  // $ExpectError
  recheck(["adsfsd"])
}
