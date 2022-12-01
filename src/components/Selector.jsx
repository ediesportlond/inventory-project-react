import { useState } from 'react';
import { Button } from 'antd';
import '../assets/selector.css';

export default function Selector({ setList }) {
  const [selected, setSelected] = useState()

  const getSelected = (selected) => {
    setSelected(selected)

  }

  const getAll = () => {
    setSelected('all')
  }

  return (
    <>
      <div className="selector-btn-container">
        {
          selected === 'instock'
            ? <>
              <Button type='primary' onClick={() => getSelected('instock')}>In stock</Button>
              <Button type='dashed' onClick={getAll}>All</Button>
              <Button danger ghost onClick={() => getSelected('nostock')}>Out of stock</Button>
            </>
            : selected === 'nostock'
            ? <>
              <Button type='primary' ghost onClick={() => getSelected('instock')}>In stock</Button>
              <Button type='dashed' onClick={getAll}>All</Button>
              <Button danger onClick={() => getSelected('nostock')}>Out of stock</Button>
            </>
            : selected === 'all'
            ? <>
              <Button type='primary' ghost onClick={() => getSelected('instock')}>In stock</Button>
              <Button onClick={getAll}>All</Button>
              <Button danger ghost onClick={() => getSelected('nostock')}>Out of stock</Button>
            </>
            : <>
            <Button type='primary' ghost onClick={() => getSelected('instock')}>In stock</Button>
            <Button type='dashed' onClick={getAll}>All</Button>
            <Button danger ghost onClick={() => getSelected('nostock')}>Out of stock</Button>
          </>
        }
      </div>
    </>
  )
}