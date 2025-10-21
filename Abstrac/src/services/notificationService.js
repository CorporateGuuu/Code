import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Initialize notifications
export const initializeNotifications = async () => {
  try {
    // Request permissions
    const { granted } = await Notifications.requestPermissionsAsync();
    if (!granted) {
      console.log('Notification permissions denied');
      return false;
    }

    // Get expo push token
    const token = await Notifications.getExpoPushTokenAsync();
    console.log('Expo push token:', token.data);

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#667eea',
      });
    }

    return token.data;
  } catch (error) {
    console.error('Error initializing notifications:', error);
    return null;
  }
};

// Send local notification
export const sendLocalNotification = async (title, body, data = {}) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
        badge: 1,
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error('Error sending local notification:', error);
  }
};

// Schedule delayed notification
export const scheduleNotification = async (title, body, seconds, data = {}) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
        badge: 1,
      },
      trigger: {
        seconds,
      },
    });
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

// Cancel all notifications
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling notifications:', error);
  }
};

// Get notification permissions status
export const getNotificationPermissions = async () => {
  try {
    return await Notifications.getPermissionsAsync();
  } catch (error) {
    console.error('Error getting notification permissions:', error);
    return null;
  }
};

// Example notification functions for dares
export const sendDareReminder = async (dareTitle, timeLeft) => {
  const title = 'Dare Reminder';
  const body = `Don't forget: "${dareTitle}" - ${timeLeft} left!`;
  await sendLocalNotification(title, body, { type: 'dare_reminder' });
};

export const sendDareCompleted = async (dareTitle) => {
  const title = 'Dare Completed!';
  const body = `Congratulations! You completed "${dareTitle}" successfully!`;
  await sendLocalNotification(title, body, { type: 'dare_completed' });
};

export const sendDareFailed = async (dareTitle) => {
  const title = 'Dare Failed';
  const body = `Sorry, you didn't complete "${dareTitle}" in time.`;
  await sendLocalNotification(title, body, { type: 'dare_failed' });
};

export const sendChallengeInvite = async (challengerName, dareTitle) => {
  const title = 'New Challenge!';
  const body = `${challengerName} challenged you to "${dareTitle}"`;
  await sendLocalNotification(title, body, { type: 'challenge_invite' });
};
