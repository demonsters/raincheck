// @flow

import when from '.'

type Item = {
  name: string
}

const checkNoValue = () => {
  const recheck = when().do((item: Item) => console.log(item.name))
  recheck({name: "s"})
}


const checkMapFunction = () => {
  const recheck = when((s: string) => ({name: s}))
    .do((item: Item) => {
      console.log(item)
    })
    
  recheck("adsfsd")

  // $ExpectError
  recheck(["adsfsd"])
}

