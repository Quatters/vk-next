import { React } from 'react';
import AddPost from './AddPost';
import Post from './Post';

export default function PostContainer(props) {
  return (
    <div className='mt-4'>
      <AddPost user={props.user} />
      {props.posts?.map(item => (
        <Post
          key={item._id}
          post={item}
          postsLimit={props.postsLimit}
          setHasMoreData={props.setHasMoreData}
        />
      ))}
    </div>
  );
}
