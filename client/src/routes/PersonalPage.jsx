import { React, Fragment, useEffect, useState, useContext } from 'react';
import { Col, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Avatar from '../components/Avatar';
import PostContainer from '../components/PostContainer';
import UserInfo from '../components/UserInfo';
import { getUser } from '../static/js/api-calls';
import CurrentUserContext from '../static/js/CurrentUserContext';
import NotificationContext from '../static/js/NotificationContext';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function PersonalPage(props) {
  const [user, setUser] = useState(null);
  const { showNotification } = useContext(NotificationContext);
  const { currentUser, refreshCurrentUser } = useContext(CurrentUserContext);
  const [requestIsCompleted, setRequestIsCompleted] = useState(false);
  const history = useHistory();
  const [limit, setLimit] = useState(10);
  const [hasMoreData, setHasMoreData] = useState(true);

  useEffect(() => {
    setLimit(10);
    const login = getLoginFromPath();

    if (login.toLowerCase() === 'me' && currentUser) {
      history.replace('/users/' + currentUser.login);
      return;
    }

    getUser(login, limit)
      .then(response => {
        setHasMoreData(
          response.data.totalPostsLength !== response.data.posts.length
        );
        setUser(response.data);
      })
      .catch(error => {
        if (error.response?.status === 401) {
          showNotification(401);
          history.push('/signin');
        } else if (error.response?.status === 404) {
          showNotification(null, 'User not found.', 'Error');
        } else showNotification();
      })
      .finally(() => {
        setRequestIsCompleted(true);
      });

    function getLoginFromPath() {
      const path = props.location.pathname;
      const pathArray = path.split('/');
      return pathArray[pathArray.length - 1];
    }
  }, [props.location, currentUser]);

  function handleLoadMore() {
    loadUser(limit + 10, hasMoreData);
    setLimit(limit + 10);
  }

  function loadUser(limit, hasMoreData) {
    if (!hasMoreData) return;

    getUser(user.login, limit)
      .then(response => {
        setHasMoreData(user?.posts?.length !== response.data?.posts?.length);
        setUser(response.data);
      })
      .catch(error => {
        setHasMoreData(false);
        showNotification();
      });
  }

  if (user)
    return (
      <Fragment>
        <Col sm={4} md={3}>
          <Avatar src={user.avatarBase64} user={user} />
        </Col>
        <Col>
          <UserInfo user={user} />
          <PostContainer
            user={user}
            posts={user.posts}
            postsLimit={limit}
            setHasMoreData={setHasMoreData}
          />
          <InfiniteScroll
            dataLength={user.posts.length}
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
      </Fragment>
    );
  else if (!requestIsCompleted)
    return (
      <Col className='d-flex justify-content-center'>
        <Spinner animation='border' variant='primary' />
      </Col>
    );
  else return null;
}
