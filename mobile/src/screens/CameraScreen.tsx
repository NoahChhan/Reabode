import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { Text, Button, Surface, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RoomImage } from '../types';

const { width, height } = Dimensions.get('window');

export default function CameraScreen() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<"back" | "front">("back");
  const [capturedImages, setCapturedImages] = useState<RoomImage[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraKey, setCameraKey] = useState(0); // Force re-render
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    getCameraPermissions();
  }, []);

  // Re-initialize camera when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('📸 Camera screen focused - re-initializing camera');
      // Force camera re-render by updating key (instant)
      setCameraKey(prev => prev + 1);
    }, [])
  );

  const getCameraPermissions = async () => {
    console.log('🔐 Requesting camera permissions...');
    const { status } = await Camera.requestCameraPermissionsAsync();
    console.log('🔐 Camera permission status:', status);
    setHasPermission(status === 'granted');
  };

  const takePicture = async () => {
    console.log('📸 Take picture called, cameraRef:', !!cameraRef.current, 'isCapturing:', isCapturing);
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,  // Compress to reduce size
        base64: true,
      });

      // Ensure proper base64 format
      let base64Data = photo.base64;
      if (base64Data && !base64Data.startsWith('data:image')) {
        base64Data = `data:image/jpeg;base64,${base64Data}`;
      }

      const newImage: RoomImage = {
        id: Date.now().toString(),
        uri: photo.uri,
        base64: base64Data,
        timestamp: Date.now(),
      };

      setCapturedImages(prev => [...prev, newImage]);
      Alert.alert('Success', 'Photo captured!');
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      // Ensure proper base64 format for gallery images too
      let base64Data = result.assets[0].base64;
      if (base64Data && !base64Data.startsWith('data:image')) {
        base64Data = `data:image/jpeg;base64,${base64Data}`;
      }

      const newImage: RoomImage = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
        base64: base64Data || undefined,
        timestamp: Date.now(),
      };

      setCapturedImages(prev => [...prev, newImage]);
      Alert.alert('Success', 'Photo added from gallery!');
    }
  };

  const removeImage = (imageId: string) => {
    setCapturedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const proceedToAnalysis = () => {
    if (capturedImages.length === 0) {
      Alert.alert('No Images', 'Please capture at least one room image');
      return;
    }

    (navigation as any).navigate('RoomAnalysis', { 
      images: capturedImages 
    });
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <Button onPress={getCameraPermissions}>Grant Permission</Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        key={cameraKey}
        style={styles.camera}
        facing={cameraType}
        ref={cameraRef}
      >
        <View style={styles.cameraOverlay}>
          {/* Header */}
          <View style={styles.header}>
            <IconButton
              icon="arrow-left"
              iconColor="white"
              onPress={() => navigation.goBack()}
            />
            <Text variant="titleLarge" style={styles.headerTitle}>
              Scan Your Room
            </Text>
            <IconButton
              icon="flip-camera-android"
              iconColor="white"
              onPress={() => setCameraType(
                cameraType === "back" ? "front" : "back"
              )}
            />
          </View>

          {/* Camera Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.galleryButton}
              onPress={pickImageFromGallery}
            >
              <IconButton icon="image" iconColor="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.captureButton, isCapturing && styles.capturingButton]}
              onPress={takePicture}
              disabled={isCapturing}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <View style={styles.placeholder} />
          </View>
        </View>
      </CameraView>

      {/* Captured Images Preview */}
      {capturedImages.length > 0 && (
        <Surface style={styles.previewContainer}>
          <Text variant="titleMedium" style={styles.previewTitle}>
            Captured Images ({capturedImages.length})
          </Text>
          <View style={styles.imageGrid}>
            {capturedImages.map((image) => (
              <View key={image.id} style={styles.imageItem}>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(image.id)}
                >
                  <IconButton icon="close" size={16} iconColor="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <Button
            mode="contained"
            onPress={proceedToAnalysis}
            style={styles.analyzeButton}
            icon="brain"
          >
            Analyze Room
          </Button>
        </Surface>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#5D8658',
    fontWeight: 'bold',
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  galleryButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  capturingButton: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  placeholder: {
    width: 50,
  },
  previewContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  previewTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageItem: {
    width: 60,
    height: 60,
    margin: 4,
    borderRadius: 8,
    backgroundColor: '#e0e7ff',
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 12,
  },
  analyzeButton: {
    marginTop: 10,
  },
});
