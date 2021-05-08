import React from 'react'
import {  useState } from "react";
import useRaincheck from '.'
import { render } from '@testing-library/react'

const Component = () => { 
  const [index, setIndex] = useState(0);

  useRaincheck((call) => {
    if (index === 0 ) {
      call(() => {
        setIndex(1);
      }, "1");
    }
    if (index === 1) {
      call(() => {
        setIndex(2);
      }, "2");
    }
  });

  if (index === 2) {
    return <>Connected</>
  }

  return null
}

test('useRaincheck', async () => {
  const dom = render(<Component />)
  const el = await dom.findByText("Connected")
  expect(el).toBeDefined()
})