import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel'; // Install: yarn add react-native-snap-carousel

const { width: screenWidth } = Dimensions.get('window');

// Define themes based on screenshot analysis (gradients from top to bottom)
const themes = {
  redOrange: ['#FF6B6B', '#D63031', '#A20F0F'], // Vibrant red-orange for high-purity stones
  blueGray: ['#74B9FF', '#2980B9', '#2C3E50'], // Cool blue-gray for medium-purity
  purpleBlue: ['#A29BFE', '#6A5ACD', '#483D8B'], // Purple-blue for low-purity or alternate
};

// Function to calculate days between dates
const getDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Function to calculate time commitment score
const calculateTimeCommitmentScore = (days) => {
  if (days > 90) return 5;
  if (days >= 30) return 3;
  return 1;
};

// Function to calculate purity score with new factors
const calculatePurityScore = (difficulty, likes, comments, wagerValue, startDate, endDate, opponentStrength, publicVerification) => {
  // Engagement Score: (likes / 10) + (comments / 5), capped at 10
  const engagementScore = Math.min((likes / 10) + (comments / 5), 10);
  // Wager Value Score: 1-5 based on predefined wager hierarchy
  const wagerValueScore = Math.max(1, Math.min(5, wagerValue));
  // Time Commitment Score: Based on days between dates
  const days = getDaysBetween(startDate, endDate);
  const timeCommitmentScore = calculateTimeCommitmentScore(days);
  // Opponent Strength Score: 1-5 based on opponent metrics
  const opponentStrengthScore = Math.max(1, Math.min(5, opponentStrength));
  // Public Verification Score: 0-3 based on proof level
  const publicVerificationScore = Math.max(0, Math.min(3, publicVerification));

  // Purity Score = (Difficulty * 0.3) + (Engagement * 0.3) + (Wager * 0.2) + (Time * 0.1) + (Opponent * 0.05) + (Verification * 0.05)
  const purityScore = (difficulty * 0.3) + (engagementScore * 0.3) + (wagerValueScore * 0.2) +
    (timeCommitmentScore * 0.1) + (opponentStrengthScore * 0.05) + (publicVerificationScore * 0.05);
  return purityScore;
};

// Function to determine theme based on purity score
const getThemeByPurity = (purityScore) => {
  if (purityScore > 7.5) return 'redOrange';
  if (purityScore >= 4) return 'blueGray';
  return 'purpleBlue';
};

// Function to determine stone reward based on purity
const getStoneReward = (purityScore) => {
  if (purityScore > 7.5) return { type: 'Diamond', amount: 1 }; // High purity
  if (purityScore >= 4) return { type: 'Sapphire', amount: 3 }; // Medium purity
  return { type: 'Quartz', amount: 5 };                        // Low purity
};

// DareCard Component
const DareCard = ({ dare, userData }) => {
  // Destructure dare object, handling both individual and group dares
  const {
    dare_id,
    title,
    creator_id,
    entry_stake,
    status,
    created_at,
    deadline,
    winner_id,
    participants,
    dareText,
    startDate,
    endDate,
    winnerUsername,
    loserUsername,
    wagerText,
    difficulty,
    likes,
    comments,
    wagerValue,
    opponentStrength,
    publicVerification
  } = dare;

  // For group dares, use title as dareText, created_at as startDate, deadline as endDate, etc.
  const actualDareText = dareText || title;
  const actualStartDate = startDate || created_at;
  const actualEndDate = endDate || deadline;
  const actualWagerText = wagerText || `Entry stake: $${entry_stake}`;
  const actualDifficulty = difficulty || 5; // Default if not provided
  const actualLikes = likes || 0;
  const actualComments = comments || 0;
  const actualWagerValue = wagerValue || entry_stake || 1;
  const actualOpponentStrength = opponentStrength || 3;
  const actualPublicVerification = publicVerification || 1;

  const purityScore = calculatePurityScore(actualDifficulty, actualLikes, actualComments, actualWagerValue, actualStartDate, actualEndDate, actualOpponentStrength, actualPublicVerification);
  const theme = getThemeByPurity(purityScore);
  const { type: stoneType, amount: stoneAmount } = getStoneReward(purityScore);

  return (
    <LinearGradient
      colors={themes[theme]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.cardContainer}
    >
      {/* Dare Description */}
      <Text style={styles.dareText}>{actualDareText}</Text>

      {/* Date Row */}
      <View style={styles.row}>
        <Text style={styles.diamond}>💎</Text>
        <Text style={styles.date}>{actualStartDate}</Text>
        <Text style={styles.separator}>--</Text>
        <Text style={styles.date}>{actualEndDate}</Text>
        <Text style={styles.diamond}>💎</Text>
      </View>

      {/* For group dares, render participants; for individual, winner/loser */}
      {participants ? (
        participants.map((participant, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.diamond}>💎</Text>
            <Text style={styles.username}>{participant.username}</Text>
            <Text style={participant.completed ? styles.dots : styles.xMark}>
              {participant.completed ? '✔' : '×'}
            </Text>
            <Text style={styles.diamond}>💎</Text>
          </View>
        ))
      ) : (
        <>
          {/* Winner Row */}
          <View style={styles.row}>
            <Text style={styles.diamond}>💎</Text>
            <Text style={styles.dots}>•••••</Text>
            <Text style={styles.username}>{winnerUsername}</Text>
            <Text style={styles.dots}>•••••</Text>
            <Text style={styles.diamond}>💎</Text>
          </View>

          {/* Loser Row */}
          <View style={styles.row}>
            <Text style={styles.diamond}>💎</Text>
            <Text style={styles.xMark}>×</Text>
            <Text style={styles.username}>{loserUsername}</Text>
            <Text style={styles.xMark}>×</Text>
            <Text style={styles.diamond}>💎</Text>
          </View>
        </>
      )}

      {/* Wager */}
      <Text style={styles.wagerText}>{actualWagerText}</Text>

      {/* Optional: Display Purity Info (for debugging or UI) */}
      <Text style={styles.purityText}>
        Purity: {purityScore.toFixed(2)} (Stone: {stoneAmount} {stoneType})
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: screenWidth * 0.9,
    padding: 20,
    borderRadius: 30, // Matches the soft rounded corners in images
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5, // Subtle glow/shadow effect
    alignItems: 'center',
  },
  dareText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent overlay for rows as in images
    borderRadius: 15,
    paddingVertical: 8,
  },
  diamond: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
  },
  date: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '400',
  },
  separator: {
    color: '#FFF',
    fontSize: 14,
    marginHorizontal: 10,
  },
  dots: {
    color: '#FFF',
    fontSize: 14,
    opacity: 0.6,
    marginHorizontal: 10,
  },
  username: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  xMark: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
    opacity: 0.8,
  },
  wagerText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10,
  },
  purityText: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.7,
  },
});

// Example Usage in a Carousel (for each post as a carousel of cards)
// Assume you have an array of dare data per post
const PostCarousel = ({ dares }) => {
  const renderItem = ({ item }) => (
    <View style={{ alignItems: 'center' }}>
      {/* Post Header (e.g., "winner beat loser") */}
      <Text style={postStyles.header}>{`${item.winnerUsername.replace('@', '')} beat ${item.loserUsername.replace('@', '')}`}</Text>

      <DareCard dare={item} />

      {/* Interactions (likes, comments) */}
      <View style={postStyles.interactions}>
        <Text style={postStyles.icon}>💬 + {item.comments}</Text>
        <Text style={postStyles.icon}>❤️ {item.likes}</Text>
        <Text style={postStyles.icon}>•••</Text>
      </View>

      {/* Sample Comments */}
      {item.sampleComments.map((comment, index) => (
        <Text key={index} style={postStyles.comment}>{comment}</Text>
      ))}
    </View>
  );

  return (
    <Carousel
      data={dares}
      renderItem={renderItem}
      sliderWidth={screenWidth}
      itemWidth={screenWidth * 0.95}
      loop={true}
      autoplay={false}
    />
  );
};

const postStyles = StyleSheet.create({
  header: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
    paddingLeft: 20,
  },
  interactions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    paddingLeft: 20,
    marginTop: 10,
  },
  icon: {
    color: '#FFF',
    fontSize: 14,
    marginRight: 15,
    opacity: 0.8,
  },
  comment: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'left',
    width: '100%',
    paddingLeft: 20,
    marginTop: 5,
  },
});

// Sample Data (based on your screenshots, map themes to stone purity/amount in your logic)
const sampleDares = [
  {
    dareText: 'I will climb a Level 8 rock climbing wall',
    startDate: '3/7/24',
    endDate: '10/3/25',
    winnerUsername: '@lukehoooton',
    loserUsername: '@maxplatt',
    wagerText: 'Buy the bar a round',
    difficulty: 9, // 1-10 scale
    likes: 76,
    comments: 25,
    wagerValue: 4, // 1-5 scale
    opponentStrength: 4, // 1-5 based on opponent's rank
    publicVerification: 2, // 0-3 based on proof (e.g., photo)
    sampleComments: ['lukehoooton unreal.', "maxplatt can't believe you actually did it. well done"],
  },
  {
    dareText: 'S&P will crash by the end of September',
    startDate: '7/30/25',
    endDate: '10/1/25',
    winnerUsername: '@mattbraun',
    loserUsername: '@kublaii',
    wagerText: 'Pay for a round of golf',
    difficulty: 6,
    likes: 431,
    comments: 35,
    wagerValue: 3,
    opponentStrength: 3,
    publicVerification: 1,
    sampleComments: ['haydnthurman LFG', 'mattbraun nooo', 'brendengroess beat ethangood'],
  },
  {
    dareText: 'SLC Fashion show IG post will get less than 3k likes',
    startDate: '5/5/25',
    endDate: '10/1/25',
    winnerUsername: '@colebrunn',
    loserUsername: '@mattgubler1',
    wagerText: "Take a 10 second pull of Burnett's",
    difficulty: 2,
    likes: 43,
    comments: 35,
    wagerValue: 2,
    opponentStrength: 2,
    publicVerification: 0,
    sampleComments: ['mattgubler1 LFG', 'colebrunn nooo', 'quitwithjones'],
  },
];

// Example usage in data processing
const daresWithThemes = sampleDares.map(dare => ({
  ...dare,
  theme: getThemeByPurity(calculatePurityScore(dare.difficulty, dare.likes, dare.comments, dare.wagerValue, dare.startDate, dare.endDate, dare.opponentStrength, dare.publicVerification)),
}));

// In your feed screen, render <PostCarousel dares={sampleDares} /> or integrate into FlatList

export { DareCard, PostCarousel, sampleDares, daresWithThemes, themes, getThemeByPurity };
