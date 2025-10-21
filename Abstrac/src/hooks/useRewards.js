import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Get pending rewards that can be claimed
export function usePendingRewards() {
  const [pendingRewards, setPendingRewards] = useState([]);
  const [totalPendingAmount, setTotalPendingAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const userId = currentUser.uid;
    const rewardsRef = collection(db, 'rewards');

    const q = query(
      rewardsRef,
      where('userId', '==', userId),
      where('claimed', '==', false)
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const rewards = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp)
        }));

        const total = rewards.reduce((sum, reward) => sum + (reward.amount || 0), 0);

        setPendingRewards(rewards);
        setTotalPendingAmount(total);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching pending rewards:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { pendingRewards, totalPendingAmount, loading };
}

// Hook for claiming all pending rewards
export function useClaimRewards() {
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState(null);

  const claimAllRewards = async () => {
    if (claiming) return; // Prevent double claiming

    setClaiming(true);
    setError(null);

    try {
      const { getFunctions, httpsCallable } = await import('firebase/functions');
      const functions = getFunctions();
      const claimRewardsFn = httpsCallable(functions, 'claimAllRewards');

      const result = await claimRewardsFn();

      if (!result.data.success) {
        throw new Error(result.data.message || 'Failed to claim rewards');
      }

      return { success: true, amount: result.data.amount };
    } catch (err) {
      console.error('Error claiming rewards:', err);
      setError(err.message);
      throw err;
    } finally {
      setClaiming(false);
    }
  };

  return { claimAllRewards, claiming, error };
}

// Get recent rewards history
export function useRewardsHistory(limitCount = 10) {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const userId = currentUser.uid;
    const rewardsRef = collection(db, 'rewards');

    const q = query(
      rewardsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      ...(limitCount ? [limit(limitCount)] : [])
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const rewardsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt)
        }));
        setRewards(rewardsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching rewards history:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limitCount]);

  return { rewards, loading };
}
