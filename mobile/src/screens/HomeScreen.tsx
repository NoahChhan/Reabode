import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  FAB,
  Chip,
  Surface,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { DesignProject } from '../types';
import { apiService } from '../services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const [projects, setProjects] = useState<DesignProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await apiService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewProject = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Camera' as never);
  };

  const handleProjectPress = (project: DesignProject) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('RoomAnalysis' as never, { project } as never);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        style={styles.header}
      >
        <Text variant="headlineLarge" style={styles.headerTitle}>
          Reabode AI
        </Text>
        <Text variant="bodyLarge" style={styles.headerSubtitle}>
          Your AI Interior Designer
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Surface style={styles.quickActions}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Quick Actions
          </Text>
          <View style={styles.actionChips}>
            <Chip
              icon="camera"
              mode="outlined"
              onPress={handleNewProject}
              style={styles.chip}
            >
              Scan Room
            </Chip>
            <Chip
              icon="palette"
              mode="outlined"
              style={styles.chip}
            >
              Mood Board
            </Chip>
            <Chip
              icon="shopping"
              mode="outlined"
              style={styles.chip}
            >
              Shop Now
            </Chip>
          </View>
        </Surface>

        <View style={styles.projectsSection}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Recent Projects
          </Text>
          {loading ? (
            <Text>Loading projects...</Text>
          ) : projects.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Text variant="bodyLarge" style={styles.emptyText}>
                  No projects yet
                </Text>
                <Text variant="bodyMedium" style={styles.emptySubtext}>
                  Start by scanning your room!
                </Text>
                <Button
                  mode="contained"
                  onPress={handleNewProject}
                  style={styles.emptyButton}
                >
                  Create First Project
                </Button>
              </Card.Content>
            </Card>
          ) : (
            projects.map((project) => (
              <TouchableOpacity
                key={project.id}
                onPress={() => handleProjectPress(project)}
                style={styles.projectCard}
              >
                <Card style={styles.projectCardContent}>
                  {project.roomImages.length > 0 && (
                    <Image
                      source={{ uri: project.roomImages[0].uri }}
                      style={styles.projectImage}
                      resizeMode="cover"
                    />
                  )}
                  <Card.Content>
                    <Text variant="titleMedium">{project.name}</Text>
                    <Text variant="bodyMedium" style={styles.projectSubtext}>
                      {project.analysis.roomType} • {project.recommendations.length} items
                    </Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <FAB
        icon="camera"
        style={styles.fab}
        onPress={handleNewProject}
        label="Scan Room"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'white',
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  quickActions: {
    marginTop: -20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  actionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  projectsSection: {
    marginBottom: 100,
  },
  emptyCard: {
    marginTop: 20,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 20,
  },
  emptyButton: {
    marginTop: 10,
  },
  projectCard: {
    marginBottom: 16,
  },
  projectCardContent: {
    overflow: 'hidden',
  },
  projectImage: {
    width: '100%',
    height: 120,
  },
  projectSubtext: {
    opacity: 0.7,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

