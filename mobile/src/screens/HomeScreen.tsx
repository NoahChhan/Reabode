import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Surface,
  IconButton,
} from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { DesignProject } from '../types';
import { apiService } from '../services/api';
import { useErrorOverlay } from '../hooks/useErrorOverlay';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const [projects, setProjects] = useState<DesignProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { ErrorOverlay } = useErrorOverlay();

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
    (navigation.navigate as any)('RoomAnalysis', { project });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Surface style={styles.quickActions}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Quick Actions
          </Text>
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              icon={({ size, color }) => <IconButton icon="camera" iconColor={color} size={32} style={{ margin: 0 }} />}
              onPress={handleNewProject}
              style={styles.actionButton}
              labelStyle={styles.actionButtonLabel}
              contentStyle={styles.actionButtonContent}
            >
              Scan Room
            </Button>
            <Button
              mode="contained"
              icon={({ size, color }) => <IconButton icon="palette" iconColor={color} size={32} style={{ margin: 0 }} />}
              style={styles.actionButton}
              labelStyle={styles.actionButtonLabel}
              contentStyle={styles.actionButtonContent}
            >
              Mood Board
            </Button>
            <Button
              mode="contained"
              icon={({ size, color }) => <IconButton icon="shopping" iconColor={color} size={32} style={{ margin: 0 }} />}
              style={styles.actionButton}
              labelStyle={styles.actionButtonLabel}
              contentStyle={styles.actionButtonContent}
            >
              Shop Now
            </Button>
          </View>
        </Surface>

        <View style={styles.projectsSection}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Recent Projects
          </Text>
          {loading ? (
            <Text>Loading projects...</Text>
          ) : projects.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Text variant="headlineSmall" style={styles.emptyText}>
                  No projects yet
                </Text>
                <Text variant="bodyLarge" style={styles.emptySubtext}>
                  Start by scanning your room!
                </Text>
                <Button
                  mode="contained"
                  onPress={handleNewProject}
                  style={styles.emptyButton}
                  labelStyle={styles.buttonLabel}
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

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8e6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  quickActions: {
    marginTop: 0,
    marginBottom: 32,
    padding: 24,
    borderRadius: 16,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 20,
    fontWeight: '600',
    color: '#2A3B28',
    fontFamily: 'Poppins-Light',
  },
  actionButtons: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    width: '85%',
    borderRadius: 16,
    backgroundColor: '#5D8658',
    elevation: 3,
    shadowColor: '#5D8658',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionButtonContent: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButtonLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  projectsSection: {
    marginBottom: 130,
    marginTop: 8,
  },
  emptyCard: {
    marginTop: 16,
    elevation: 1,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Poppins-Light',
  },
  emptySubtext: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 28,
    fontFamily: 'Poppins-Light',
  },
  emptyButton: {
    marginTop: 8,
    paddingHorizontal: 12,
    backgroundColor: '#5D8658',
  },
  buttonLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  projectCard: {
    marginBottom: 20,
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
});

