import React from 'react';
import { useFriendStatsList } from './dare-social/src/hooks/useDarePairs';
import { formatStreak, formatLastDareDate } from './dare-social/src/services/darePairService';

// Test component to demonstrate friend stats functionality
export default function TestFriendStats({ currentUserId }) {
  const pairs = useFriendStatsList(currentUserId);

  return (
    <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: 'white' }}>
      <h2>Dare Pairs Relationship Tracker</h2>
      <p>Current User: {currentUserId || 'Not authenticated'}</p>

      {pairs.length === 0 ? (
        <p>No dare relationships found.</p>
      ) : (
        <div>
          <h3>Your Dare Relationships ({pairs.length})</h3>
          {pairs.map((pair) => (
            <div key={pair.pair_id} style={{
              border: '1px solid #333',
              padding: '15px',
              margin: '10px 0',
              borderRadius: '8px',
              backgroundColor: '#2a2a2a'
            }}>
              <h4>Pair with: {pair.userA === currentUserId ? pair.userB : pair.userA}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div><strong>Total Dares:</strong> {pair.total_dares}</div>
                <div><strong>Current Streak:</strong> {formatStreak(pair.current_streak)}</div>
                <div><strong>Last Dare:</strong> {formatLastDareDate(pair.last_dare_date)}</div>
                <div><strong>Pair ID:</strong> {pair.pair_id}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#333', borderRadius: '8px' }}>
        <h4>How it works:</h4>
        <ul style={{ lineHeight: '1.6' }}>
          <li>Streak data is automatically tracked when dares are completed between users</li>
          <li>Pair IDs are sorted alphabetically for consistency (e.g., uid_123_uid_456)</li>
          <li>Streak counter increments when dares are completed within 2 days of each other</li>
          <li>Streak resets to 1 when more than 2 days pass between completed dares</li>
          <li>Total dares count increments with every completed dare between the pair</li>
        </ul>
      </div>
    </div>
  );
}
