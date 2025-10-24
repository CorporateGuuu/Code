import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PostCarousel, daresWithThemes } from '../components/DareCard';

const PostCarouselScreen = () => {
  return (
    <View style={styles.container}>
      <PostCarousel dares={daresWithThemes} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 50, // Space for status bar
  },
});

export default PostCarouselScreen;
