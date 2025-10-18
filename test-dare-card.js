// Test file to demonstrate how to use the updated DareCard component
import DareCard from './dare-social/src/components/DareCard.js';

// Example usage with the provided group dare structure
const exampleGroupDare = {
  "dare_id": "group_dare_001",
  "title": "Who can run 5K every day for a week?",
  "creator_id": "uid_123",
  "entry_stake": 25,
  "status": "open",
  "created_at": "2025-10-17T18:00:00Z",
  "deadline": "2025-10-24T18:00:00Z",
  "winner_id": "",
  "participants": [
    {
      "user_id": "uid_123",
      "username": "fitz",
      "avatar": "https://cdn.example.com/avatar.jpg",
      "proof_url": "",
      "votes": 5,
      "completed": true
    },
    {
      "user_id": "uid_456",
      "username": "daniel",
      "avatar": "https://cdn.example.com/avatar2.jpg",
      "proof_url": "",
      "votes": 2,
      "completed": false
    }
  ]
};

// Usage in React component:
function DareList() {
  const userData = {
    username: "testuser",
    avatar: "https://example.com/avatar.jpg"
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h1 className="text-white text-xl mb-4">Group Dare Test</h1>
      <DareCard dare={exampleGroupDare} userData={userData} />
    </div>
  );
}

export default DareList;
