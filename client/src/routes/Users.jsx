import { React, useState, useEffect, useContext } from 'react';
import UserContainer from '../components/UserContainer';
import { Col, Spinner } from 'react-bootstrap';
import { getUsers } from '../static/js/api-calls';
import NotificationContext from '../static/js/NotificationContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import UserSearch from '../components/UserSearch';

export default function Users() {
  const [users, setUsers] = useState([]);
  const { showNotification } = useContext(NotificationContext);
  const [limit, setLimit] = useState(10);
  const [hasMoreData, setHasMoreData] = useState(true);

  useEffect(() => {
    loadUsers(limit, hasMoreData);
  }, []);

  function loadUsers(limit, hasMoreData) {
    if (!hasMoreData) return;

    getUsers(limit)
      .then(response => {
        setHasMoreData(response.data.users.length !== response.data.totalUsers);
        setUsers(response.data.users);
      })
      .catch(error => {
        setHasMoreData(false);
        showNotification();
      });
  }

  function handleLoadMore() {
    loadUsers(limit + 10, hasMoreData);
    setLimit(limit + 10);
  }

  function handleSearch(query) {
    setHasMoreData(!query);

    if (!query || query === '') {
      setLimit(10);
      setHasMoreData(true);
      loadUsers(10, true);
      return;
    }

    getUsers(50, 0, query.trim())
      .then(response => {
        setUsers(response.data.users);
      })
      .catch(error => {
        setHasMoreData(false);
        showNotification();
      });
  }

  return (
    <Col>
      <UserSearch className='mb-4' onSearch={handleSearch} />
      <UserContainer users={users} />
      <InfiniteScroll
        dataLength={users.length}
        next={handleLoadMore}
        hasMore={hasMoreData}
        scrollThreshold={0.82}
        loader={
          <div className='d-flex mt-3 mb-5 justify-content-center'>
            <Spinner animation='border' variant='primary' />
          </div>
        }
      />
    </Col>
  );
}
