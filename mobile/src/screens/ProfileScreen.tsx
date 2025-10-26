import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Card,
  List,
  Switch,
  Button,
  Divider,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#5D8658', '#7FB878']}
        style={styles.header}
      >
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Profile
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Settings
            </Text>
            
            <List.Item
              title="Notifications"
              description="Get notified about new recommendations"
              right={() => <Switch value={true} />}
            />
            
            <List.Item
              title="Auto-save Projects"
              description="Automatically save your design projects"
              right={() => <Switch value={true} />}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              About
            </Text>
            
            <List.Item
              title="Version"
              description="1.0.0"
            />
            
            <List.Item
              title="Privacy Policy"
              onPress={() => {}}
            />
            
            <List.Item
              title="Terms of Service"
              onPress={() => {}}
            />
          </Card.Content>
        </Card>

        <Button
          mode="outlined"
          onPress={() => {}}
          style={styles.logoutButton}
        >
          Sign Out
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf4dc',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
    color: '#2A3B28',
  },
  logoutButton: {
    marginTop: 30,
    marginBottom: 50,
  },
});

