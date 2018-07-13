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
  
  // $ExpectError: should fail
  recheck({item1: "s"})
}

const check5 = () => {

  type VideochatSettings = {
    name: string
  }

  const settings = {
    key: {
      name: "string"
    }
  }

  const connect = () => {}

  const doRemote = forEachEntry((): {[key: string]: VideochatSettings} => settings).do(connect)
    .filter((item: VideochatSettings) => !!item.name)

    doRemote()
}

const check6 = () => {
  
  type ValueState = {
    [key: string]: string
  }
  type State = {
    value: ValueState
  }

  const tester = forEachEntry((s: State): ValueState => s.value).do((v: string) => {
    
  })

  const obj1 = "object 1"
  tester({
    value: {
      key: obj1 
    }
  });
}
