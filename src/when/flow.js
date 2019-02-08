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


const checkWithMapAndSettings = () => {
  const recheck = when(
    (s: string) => ({name: s}), {
      do: () => {
        
      }
    }
  )
    
  recheck("adsfsd")

  // $ExpectError
  recheck(["adsfsd"])
}



const checkWithDepenencies = () => {
  type Ob = {
    name: string,
    value: number
  }
  const recheck = when(
    (s: Ob) => s.name, {
      and: [(s: Ob) => s.value],
      do: (name: string, value: number) => {
        
      }
    }
  )
    
  recheck(({name: "s", value: 1}))

}
