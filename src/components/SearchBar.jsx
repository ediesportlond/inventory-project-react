import { Input } from 'antd';
const { Search } = Input;
export default function SearchBar() {
  const onSearch = (value) => console.log(value);
  return (
    <>
      <Search
        placeholder="Search by product, brand or group"
        allowClear
        enterButton="Search"
        size="large"
        onSearch={onSearch}
      />
    </>
  )
}