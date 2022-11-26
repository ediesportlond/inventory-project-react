import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../App';
import Nav from '../components/Nav';
import AddNew from '../components/AddNew';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import '../assets/inventory.css';

export default function Inventory() {
  const { token } = useContext(UserContext);
  const [list, setList] = useState([]);
  const [showAddNew, setShowAddNew] = useState(false);
  useEffect(() => {
    fetch(process.env.REACT_APP_ENDPOINT + '/inventory', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    })
      .then(res => res.json())
      .then((result) => setList(result.message))
      .catch(console.error)
  }, [token])

  return (
    <>
      <Nav />
      {
        !Array.isArray(list)
          ? <p>⏱ Loading ... ⏱</p>
          : list.map(item => (
            <>
              <p key={item._id}>Item Id {item._id}</p>
              <p>User Id {item.uid}</p>
              <img src={item.image} alt="" width='300' />
            </>
          ))
      }
      {showAddNew && <AddNew setShowAddNew={setShowAddNew} setList={setList}/>}
      <Button
        className='modal-btn'
        onClick={()=>setShowAddNew(true)}
        size='large'
        shape='circle'
        type='primary'
        icon={<PlusOutlined />}
      />
    </>
  )
}