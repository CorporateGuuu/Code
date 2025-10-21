import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

// Whether to use mock data or real Firebase functions
// Set to false to use production Firebase functions, true to use mock data
export const USE_MOCK = true;

// Mock dares data
const mockDares = [
  {
    dare_id: "mock-dare-1",
    creatorId: "mock-user-id",
    participants: ["mock-user-id", "user2"],
    title: "Dance Challenge",
    description: "Dance for 1 minute straight!",
    type: "challenge",
    status: "active",
    stake: 50,
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    dare_id: "mock-dare-2",
    creatorId: "mock-user-id",
    participants: ["mock-user-id"],
    title: "Morning Run",
    description: "Run 5km before breakfast",
    type: "personal",
    status: "completed",
    stake: 75,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    deadline: new Date().toISOString(),
  },
  {
    dare_id: "mock-dare-3",
    creatorId: "user2",
    participants: ["user2", "mock-user-id"],
    title: "Learn a New Word",
    description: "Learn and use one new word today",
    type: "educational",
    status: "active",
    stake: 25,
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 172800000).toISOString(), // 2 days
  },
  {
    dare_id: "mock-dare-4",
    creatorId: "mock-user-id",
    participants: ["mock-user-id"],
    title: "Healthy Meal Prep",
    description: "Prepare healthy meals for the week",
    type: "lifestyle",
    status: "pending",
    stake: 100,
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    deadline: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
];

export function useDares() {
  const [dares, setDares] = useState([]);

  useEffect(() => {
    if (USE_MOCK) {
      // Use mock data
      setDares(mockDares);
    } else {
      // Use real Firebase data
      const unsub = onSnapshot(collection(db, "dares"), (snapshot) => {
        setDares(snapshot.docs.map((doc) => ({ dare_id: doc.id, ...doc.data() })));
      });
      return () => unsub();
    }
  }, []);

  return dares;
}
