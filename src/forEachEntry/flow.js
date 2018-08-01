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

  recheck({item1: {name: "s"}})

  // $ExpectError: should fail
  recheck({item1: "s"})
}



const checkWithFilter = () => {

  type State = {
    settings: {[key: string]: VideochatSettings}
  }

  type VideochatSettings = {
    name: string
  }

  const settings = {
    key: {
      name: "string"
    }
  }

  const state: State = {
    settings
  }

  const connect = (s: VideochatSettings) => {}

  const doRemote = forEachEntry((s: State): {[key: string]: VideochatSettings} => s.settings).do(connect)
    .filter((item: VideochatSettings) => !!item.name)

  doRemote(state)
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


const checkWithChangedFunction = () => {

  type VideochatSettings = {
    name: string
  }

  const modConfStatusActor = forEachEntry().do((settings: VideochatSettings) => {
    
  },
  (settings: VideochatSettings, oldSettings?: VideochatSettings) => {
    
  })

  const settings = {
    key: {
      name: ""
    }
  }

  modConfStatusActor(settings)

}
