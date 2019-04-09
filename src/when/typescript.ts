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

  // @ts-ignore: Should fail
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

  // @ts-ignore: Should fail
  recheck(["adsfsd"])
}


const checkWith1Depenencies = () => {
  type Ob = {
    name: string,
    value: number
  }
  const recheck = when(
    (s: Ob) => s.name, {
      and: [s => s.value],
      do: (name: string, value: number) => {
        
      }
    }
  )
    
  recheck(({name: "s", value: 1}))

}

const checkWith2Depenencies = () => {
  type Ob = {
    name: string,
    value: number,
    value2: boolean,
  }
  const recheck = when(
    (s: Ob) => s.name, {
      and: [
        s => s.value,
        s => s.value2,
      ],
      do: (name: string, value: number, value2: boolean) => {
        
      }
    }
  )
    
  recheck(({name: "s", value: 1}))

}
