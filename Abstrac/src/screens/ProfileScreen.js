import { useContext, useState, useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, View, FlatList } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AuthContext } from '../context/AuthContext';
import { getUserReferralData } from '../services/referralService';
import { useThemeColor } from '../hooks/use-theme-color';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';
import { getUserPosts } from '../services/postService';

export default function ProfileScreen(props) {
  const { navigation, route } = props;
  const { user, logout, loading } = useContext(AuthContext);

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const accentColor = useThemeColor({}, 'accent');
  const borderColor = useThemeColor({}, 'border');
  const secondaryTextColor = useThemeColor({}, 'tabIconDefault');

  const dynamicStyles = getDynamicStyles(backgroundColor, cardColor, textColor, accentColor, borderColor, secondaryTextColor);
  const [referralData, setReferralData] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const profileUser = route.params?.user || user;
  const isOwnProfile = !route.params?.user;
  const [followersCount, setFollowersCount] = useState(0);
  const [winRate, setWinRate] = useState(0);

  // Calculate win rate and load followers count
  useEffect(() => {
    const calculateWinRate = () => {
      if (profileUser?.totalDaresCompleted > 0) {
        const rate = ((profileUser?.wins || 0) / profileUser.totalDaresCompleted) * 100;
        setWinRate(Math.round(rate));
      } else {
        setWinRate(0);
      }
    };

    const loadFollowersCount = async () => {
      if (profileUser?.id) {
        try {
          // Get followers count from Firestore
          const followersQuery = collection(db, 'users', profileUser.id, 'followers');
          const followersSnap = await getDocs(followersQuery);
          setFollowersCount(followersSnap.size);
        } catch (error) {
          console.error('Error loading followers count:', error);
          setFollowersCount(0);
        }
      }
    };

    calculateWinRate();
    loadFollowersCount();
  }, [profileUser]);

  // Load user posts
  useEffect(() => {
    const loadPosts = async () => {
      if (profileUser?.id) {
        setPostsLoading(true);
        try {
          const response = await getUserPosts(profileUser.id);
          if (response.data && response.data.posts) {
            setUserPosts(response.data.posts);
          } else {
            setUserPosts([]);
          }
        } catch (error) {
          console.error('Error loading posts:', error);
          setUserPosts([]);
        } finally {
          setPostsLoading(false);
        }
      }
    };
    loadPosts();
  }, [profileUser?.id]);

  useEffect(() => {
    if (isOwnProfile && user) {
      loadReferralData();
    }
  }, [isOwnProfile, user]);

  const loadReferralData = async () => {
    try {
      const data = await getUserReferralData();
      setReferralData(data);
    } catch (error) {
      console.error('Error loading referral data:', error);
    }
  };



  if (loading) {
    return (
      <ThemedView style={dynamicStyles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!user) {
    return (
      <ThemedView style={dynamicStyles.container}>
        <ThemedText>Error loading profile. Please try again.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.safeContainer}>
      {/* Settings and Logout buttons for own profile */}
      {isOwnProfile && (
        <View style={dynamicStyles.settingsButtonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Privacy')}>
            <Ionicons name="settings-outline" size={24} color={accentColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => logout()}>
            <Ionicons name="log-out-outline" size={24} color={accentColor} />
          </TouchableOpacity>
        </View>
      )}

      <ThemedView style={dynamicStyles.container}>
        {/* Profile Header */}
        <View style={dynamicStyles.profileHeader}>
          {/* Avatar with side stats */}
          <View style={dynamicStyles.avatarContainer}>
            <View style={dynamicStyles.avatarStatLeft}>
              <ThemedText style={dynamicStyles.avatarStatValue}>{winRate}%</ThemedText>
              <ThemedText style={dynamicStyles.avatarStatLabel}>Win Rate</ThemedText>
            </View>

            <Image source={{ uri: profileUser.avatar }} style={dynamicStyles.avatar} />

            <View style={dynamicStyles.avatarStatRight}>
              <ThemedText style={dynamicStyles.avatarStatValue}>{followersCount}</ThemedText>
              <ThemedText style={dynamicStyles.avatarStatLabel}>Friends</ThemedText>
            </View>
          </View>

          <ThemedText style={dynamicStyles.username}>{profileUser.username || '@you'}</ThemedText>

          {/* Action Button */}
          {isOwnProfile ? (
            <TouchableOpacity style={dynamicStyles.editProfileButton} onPress={() => navigation.navigate('EditProfile')}>
              <ThemedText style={dynamicStyles.editProfileText}>Edit Profile</ThemedText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={dynamicStyles.messageButton} onPress={() => navigation.navigate('Chat', { user: profileUser.username })}>
              <ThemedText style={dynamicStyles.messageText}>Message</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Content Area */}
        {postsLoading ? (
          <View style={dynamicStyles.emptyContainer}>
            <ThemedText>Loading posts...</ThemedText>
          </View>
        ) : userPosts.length > 0 ? (
          <FlatList
            style={dynamicStyles.postsGrid}
            data={userPosts}
            keyExtractor={(item) => item.id}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity style={dynamicStyles.postItem} onPress={() => navigation.navigate('PostDetails', { post: item })}>
                <Image source={{ uri: item.image || profileUser.avatar }} style={dynamicStyles.postImage} />
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={dynamicStyles.emptyContainer}>
            <Ionicons name="images-outline" size={64} color={secondaryTextColor} />
            <ThemedText style={dynamicStyles.emptyText}>No posts yet</ThemedText>
          </View>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

// Helper functions
const getTimeAgo = (date) => {
  if (!date) return 'Unknown time';
  const now = new Date();
  const timeDiff = now - new Date(date);
  const minutes = Math.floor(timeDiff / 60000);
  const hours = Math.floor(timeDiff / 3600000);
  const days = Math.floor(timeDiff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const getActivityText = (activity) => {
  switch (activity.type) {
    case 'dare':
      return activity.winner ? `${activity.winner.username} beat ${activity.losers[0]?.username} in "${activity.title}"` : `Completed "${activity.title}"`;
    case 'post':
      return activity.text ? activity.text.substring(0, 50) + (activity.text.length > 50 ? '...' : '') : 'Posted something new';
    default:
      return 'Performed an action';
  }
};

const getDynamicStyles = (backgroundColor, cardColor, textColor, accentColor, borderColor, secondaryTextColor) => StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#000000' },
  container: { flex: 1, backgroundColor: '#000000' },
  settingsButtonContainer: { position: 'absolute', top: 10, right: 20, flexDirection: 'row', gap: 15, zIndex: 10 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: backgroundColor
  },
  avatarHeader: { width: 40, height: 40, borderRadius: 20 },
  logo: { flex: 1, textAlign: 'center', fontSize: 24 },
  stones: {},
  stonesText: { fontSize: 16 },
  logout: { marginLeft: 10, color: accentColor },

  // Profile Header Section
  profileHeader: { alignItems: 'center', padding: 20 },
  avatarContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: accentColor },
  avatarStatLeft: { alignItems: 'center', marginRight: 20 },
  avatarStatRight: { alignItems: 'center', marginLeft: 20 },
  avatarStatValue: { fontSize: 16, fontWeight: 'bold', color: textColor },
  avatarStatLabel: { fontSize: 12, color: secondaryTextColor, marginTop: 2 },
  username: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  bio: { fontSize: 14, textAlign: 'center', marginBottom: 12, color: textColor },

  // Stats Section
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 16 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: textColor },
  statLabel: { fontSize: 12, color: secondaryTextColor, marginTop: 4 },

  // Edit Profile Button
  editProfileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 32,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: accentColor
  },
  editProfileText: { fontSize: 14, fontWeight: '600' },

  // Action Button for Others
  messageButton: {
    backgroundColor: accentColor,
    borderRadius: 6,
    paddingHorizontal: 32,
    paddingVertical: 8
  },
  messageText: { fontSize: 14, fontWeight: '600', color: 'white' },

  // Post Grid
  postsGrid: { flex: 1 },
  postItem: { flex: 1, margin: 1 },
  postImage: { width: '100%', aspectRatio: 1 },

  // Empty State
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Legacy styles (keeping for compatibility)
  content: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    backgroundColor: backgroundColor
  },
  realAvatar: { width: 96, height: 96, borderRadius: 48, marginTop: 8, marginBottom: 10, borderWidth: 2, borderColor: accentColor },
  name: { fontSize: 20, fontWeight: "700" },
  meta: { marginTop: 4, marginBottom: 16 },
  block: { alignSelf: "stretch", backgroundColor: cardColor, borderRadius: 12, padding: 12, marginBottom: 12 },
  blockTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  actionButtons: { flexDirection: 'row', justifyContent: 'center', marginVertical: 16 },
  actionButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25, borderWidth: 1, borderColor: accentColor },
  actionText: { fontSize: 16, marginLeft: 8 },
  subtitle: { fontSize: 14, marginBottom: 8, color: '#888' },
  dareItem: { marginVertical: 4 },
  dareMeta: { fontSize: 12, color: '#666' },
  viewMore: { fontSize: 12, color: accentColor, textAlign: 'center', marginTop: 8 },
  emptyText: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8 },
  activityItem: { marginVertical: 4 },
  activityText: { fontSize: 14 },
  activityMeta: { fontSize: 12, color: '#666', marginTop: 2 },
  settingItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  settingItemLast: { borderBottomWidth: 0 },
  settingIcon: { fontSize: 20, marginRight: 12, color: accentColor },
  settingText: { flex: 1, fontSize: 16 },
  statsBlock: { alignSelf: "stretch", backgroundColor: cardColor, borderRadius: 12, padding: 12, marginBottom: 12 },
  statsTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  stonesSummary: { fontSize: 14, textAlign: 'center' },
  mutualsText: { fontSize: 14, textAlign: 'center', color: '#666' },
  winRateText: { fontSize: 16, textAlign: 'center', fontWeight: 'bold', color: accentColor },
});
