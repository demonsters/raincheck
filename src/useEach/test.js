

import { useState } from 'react'
import { renderHook, act } from '@testing-library/react-hooks'

import useEach from './'

describe('useEach', () => {

  test('default', () => {

    let setState
    let start = jest.fn()
    let teardown = jest.fn()

    const { result, rerender, unmount } = renderHook((props) => {
      return useEach(props.state, (value) => {
        start(value)
        return teardown
      })
    })
    rerender({
      state: [
        'key1',
        'key2',
      ]
    })
    expect(start).toBeCalledTimes(2)
    expect(start).toBeCalledWith('key1')
    expect(start).toBeCalledWith('key2')

    rerender({
      state: [
        'key1',
      ]
    })
    expect(teardown).toBeCalledTimes(1)
    
    unmount()
    expect(teardown).toBeCalledTimes(2)
  })


  test('keyExtractor', () => {

    let setState
    let start = jest.fn()
    let teardown = jest.fn()

    const { result, rerender, unmount } = renderHook((props) => {
      return useEach(props.state, (value) => {
        start(value)
        return teardown
      }, p => p.name)
    })
    rerender({
      state: [
        {name: 'key1'},
        {name: 'key2'},
      ]
    })
    expect(start).toBeCalledTimes(2)
    expect(start).toBeCalledWith({name: 'key1'})
    expect(start).toBeCalledWith({name: 'key2'})

    rerender({
      state: [
        {name: 'key1'},
      ]
    })
    expect(teardown).toBeCalledTimes(1)
    
    unmount()
    expect(teardown).toBeCalledTimes(2)
  })
})