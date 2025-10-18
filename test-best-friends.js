import React from 'react';
import { useBestFriends } from './dare-social/src/hooks/useBestFriends';
import { formatStreak, formatLastDareDate } from './dare-social/src/services/darePairService';

// Test component to demonstrate best friends functionality
export default function TestBestFriends({ currentUserId }) {
  const { bestFriends, loading } = useBestFriends();

  if (loading) {
    return <div>Loading best friends...</div>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: 'white' }}>
      <h2>🏆 Your Best Dare Friends</h2>
      <p>Current User: {currentUserId || 'Not authenticated'}</p>

      {bestFriends.length === 0 ? (
        <p>No dare relationships found yet.</p>
      ) : (
        <div>
          <h3>Top {bestFriends.length} Daring Partners</h3>
          {bestFriends.map((friend, index) => (
            <div key={friend.friendId} style={{
              border: '2px solid #ffd700',
              padding: '15px',
              margin: '10px 0',
              borderRadius: '8px',
              backgroundColor: '#2a2a2a'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{
                  backgroundColor: '#ffd700',
                  color: '#000',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  #{index + 1}
                </div>
                <h4>vs {friend.friendId}</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div><strong>Total Dares:</strong> {friend.total_dares}</div>
                <div><strong>Current Streak:</strong> {formatStreak(friend.current_streak)}</div>
                <div><strong>Last Dare:</strong> {formatLastDareDate(friend.last_dare_date)}</div>
                <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#333', borderRadius: '4px' }}>
                  Ranked by total dares completed
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#333', borderRadius: '8px' }}>
        <h4>How Best Friends Ranking Works:</h4>
        <ul style={{ lineHeight: '1.6' }}>
          <li>Ranks dare partners by total completed dares (most active first)</li>
          <li>Uses array-contains query on pair_ids for efficient lookup</li>
          <li>Limited to top 5 relationships per user</li>
          <li>Real-time updates when new dares complete</li>
          <li>Shows streak information for each relationship</li>
        </ul>
      </div>
    </div>
  );
}
