import {Card, Avatar} from 'antd';

export default function UpdateCard({item}) {
  return (
    <>
      <Card title={item.productName} extra={<Avatar src={item.image || 'https://placekitten.com/100/100'} />}>
        <>
          <p>Available: {item.inventory}</p>
          <p>Percent Remaining: {item.percentRemaining}</p>
          {item.replaceBy ? <p>Replace By: {item.replaceBy}</p> : null}
        </>
      </Card>
    </>
  )
}