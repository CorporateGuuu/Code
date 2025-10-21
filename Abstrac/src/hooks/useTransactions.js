import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export function useTransactions(limitCount = 20) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const userId = currentUser.uid;
    const transactionsRef = collection(db, 'users', userId, 'transactions');

    const q = query(
      transactionsRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const transactionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp)
        }));
        setTransactions(transactionsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching transactions:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limitCount]);

  return { transactions, loading, error };
}

export function useMonthlyStats() {
  const [stats, setStats] = useState({
    earned: 0,
    lost: 0,
    net: 0,
    count: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const userId = currentUser.uid;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const transactionsRef = collection(db, 'users', userId, 'transactions');
    const q = query(
      transactionsRef,
      where('timestamp', '>=', startOfMonth),
      where('timestamp', '<=', now)
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        let earned = 0;
        let lost = 0;

        snapshot.docs.forEach(doc => {
          const transaction = doc.data();
          const amount = transaction.amount || 0;

          if (amount > 0) {
            earned += amount;
          } else {
            lost += Math.abs(amount);
          }
        });

        setStats({
          earned,
          lost,
          net: earned - lost,
          count: snapshot.size
        });
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching monthly stats:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { stats, loading };
}
