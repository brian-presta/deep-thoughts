import React from 'react';
import { useQuery } from '@apollo/react-hooks'
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries'
import ThoughtList from '../components/ThoughtList'
import FriendList from '../components/FriendList'

const Home = ({ loggedIn }) => {
  const { loading: loadingThoughts, data: thoughtData } = useQuery(QUERY_THOUGHTS)
  const { loading:loadingUser, data:  userData } = useQuery(QUERY_ME_BASIC)
  const thoughts = thoughtData ? thoughtData.thoughts : []
  const user = userData ? userData.me : {}
  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
          {loadingThoughts ? <div>Loading...</div> 
          : (
            <ThoughtList thoughts={thoughts} title="Thoughts" />
          )}
        </div>
        {loggedIn && (
          <div className="col-12 col-lg-3 mb-3">
            {loadingUser ? <div>Loading...</div> : (
              <FriendList
                username={user.username}
                friendCount={user.friendCount}
                friends={user.friends}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
