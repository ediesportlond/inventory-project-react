import { useNavigate } from 'react-router-dom';
import { Input } from 'antd';
const { Search } = Input;

export default function SearchBar() {
  const navigate = useNavigate();
  const onSearch = (value) => navigate(`/search/${value}`);

  return (
    <>
      <Search
        placeholder="Search by product, brand or group"
        allowClear
        enterButton="Search"
        size="large"
        style={{padding: '0 1.25rem'}}
        onSearch={onSearch}
      />
    </>
  )
}