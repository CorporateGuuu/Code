import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemedView } from '../../components/themed-view';
import { useThemeColor } from '../../hooks/use-theme-color';
import { useTransactions, useMonthlyStats } from '../hooks/useTransactions';
import { usePendingRewards, useClaimRewards } from '../hooks/useRewards';

export default function PayoutPunishmentScreen() {
  const { user } = useContext(AuthContext);
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({}, 'card');

  const currentBalance = user?.stones || 0;
  const { transactions, loading: transactionsLoading } = useTransactions(10);
  const { stats: monthlyStats } = useMonthlyStats();
  const { totalPendingAmount: pendingAmount, pendingRewards } = usePendingRewards();
  const { claimAllRewards, claiming } = useClaimRewards();

  const handleClaimRewards = async () => {
    try {
      const result = await claimAllRewards();
      Alert.alert('Success', `Claimed ${result.amount} Stones! 🎉`);
    } catch (error) {
      Alert.alert('Error', 'Failed to claim rewards. Please try again.');
    }
  };

  const getAmountColor = (amount) => {
    if (amount > 0) return '#00FF00'; // Green for gains
    if (amount < 0) return '#FF4444'; // Red for losses
    return '#FFD700'; // Gold for neutral
  };

  const formatTransactionType = (type) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header Balance Info */}
      <View style={[styles.headerCard, { backgroundColor: cardColor }]}>
        <View style={styles.balanceSection}>
          <Text style={[styles.balanceLabel, { color: textColor }]}>Current Balance</Text>
          <Text style={[styles.balanceAmount, { color: textColor }]}>
            {currentBalance} 🪨
          </Text>
        </View>

        {pendingAmount > 0 && (
          <View style={styles.pendingSection}>
            <Text style={[styles.pendingLabel, { color: textColor }]}>Pending Rewards</Text>
            <Text style={[styles.pendingAmount, { color: '#FFD700' }]}>
              +{pendingAmount} 🪨
            </Text>
            <TouchableOpacity
              style={[styles.claimBtn, claiming && styles.claimBtnDisabled]}
              onPress={handleClaimRewards}
              disabled={claiming}
            >
              <Text style={styles.claimText}>
                {claiming ? 'Claiming...' : 'Claim All'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Transaction History */}
      <View style={[styles.historyCard, { backgroundColor: cardColor }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Recent Activity</Text>
        <ScrollView style={styles.transactionsList}>
          {transactionsLoading ? (
            <Text style={[styles.loading, { color: textColor }]}>Loading transactions...</Text>
          ) : transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <View
                key={transaction.id}
                style={[
                  styles.transactionItem,
                  { borderBottomColor: backgroundColor },
                  index === transactions.length - 1 && { borderBottomWidth: 0 }
                ]}
              >
                <View style={styles.transactionInfo}>
                  <Text style={[styles.transactionType, { color: textColor }]}>
                    {formatTransactionType(transaction.type)}
                  </Text>
                  <Text style={[styles.transactionDesc, { color: '#888' }]}>
                    {transaction.description || 'Transaction'}
                  </Text>
                </View>
                <Text style={[styles.transactionAmount, { color: getAmountColor(transaction.amount) }]}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} 🪨
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.empty, { color: textColor }]}>
              No transactions yet. Complete dares to earn rewards!
            </Text>
          )}
        </ScrollView>
      </View>

      {/* Stats Summary */}
      <View style={[styles.statsCard, { backgroundColor: cardColor }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>This Month</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#00FF00' }]}>
              +{monthlyStats.earned || 0}
            </Text>
            <Text style={[styles.statLabel, { color: textColor }]}>Stone Earned</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#FF4444' }]}>
              -{monthlyStats.lost || 0}
            </Text>
            <Text style={[styles.statLabel, { color: textColor }]}>Stone Lost</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: getAmountColor(monthlyStats.net) }]}>
              {monthlyStats.net > 0 ? '+' : ''}{monthlyStats.net || 0}
            </Text>
            <Text style={[styles.statLabel, { color: textColor }]}>Net Gain</Text>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  pendingSection: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 16,
  },
  pendingLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  pendingAmount: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
  },
  claimBtn: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  claimBtnDisabled: {
    opacity: 0.6,
  },
  claimText: {
    color: '#000',
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
    fontStyle: 'italic',
  },
  historyCard: {
    flex: 1,
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  transactionsList: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsCard: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});
