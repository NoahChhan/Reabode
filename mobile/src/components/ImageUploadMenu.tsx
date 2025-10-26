import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";

export type UploadMode = 1 | 2 | 3 | 4 | 5;

interface ImageUploadMenuProps {
  selectedMode: UploadMode;
  onModeSelect: (mode: UploadMode) => void;
  capturedImages: string[];
  onRemoveImage: (index: number) => void;
  onStartCapture: () => void;
}

const uploadModes = [
  {
    id: 1 as UploadMode,
    title: "Single Wall Photo",
    description: "Fast, easy for user",
    pros: ["Quick setup", "Simple process"],
    cons: ["No depth info", "Limited geometry"],
    recommended: false,
  },
  {
    id: 2 as UploadMode,
    title: "Adjacent Corners",
    description: "Better understanding of geometry",
    pros: ["Better depth estimation", "Improved accuracy"],
    cons: ["More complex setup"],
    recommended: true,
  },
  {
    id: 3 as UploadMode,
    title: "Full Room Sweep",
    description: "3-5 photos around room",
    pros: ["3D reconstruction", "Best accuracy"],
    cons: ["More upload time", "Higher complexity"],
    recommended: true,
  },
];

export const ImageUploadMenu: React.FC<ImageUploadMenuProps> = ({
  selectedMode,
  onModeSelect,
  capturedImages,
  onRemoveImage,
  onStartCapture,
}) => {
  const getRequiredImages = (mode: UploadMode): number => {
    switch (mode) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 3:
        return 3;
      case 4:
        return 4;
      case 5:
        return 5;
      default:
        return 1;
    }
  };

  const requiredImages = getRequiredImages(selectedMode);
  const canStartCapture = capturedImages.length < requiredImages;

  const handleModeSelect = (mode: UploadMode) => {
    onModeSelect(mode);
    // Clear existing images when changing mode
    if (capturedImages.length > 0) {
      Alert.alert(
        "Change Mode",
        "Changing modes will clear your captured images. Continue?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Continue", onPress: () => onModeSelect(mode) },
        ]
      );
    } else {
      onModeSelect(mode);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Room Capture Mode</Text>
      <Text style={styles.subtitle}>
        Choose how many photos to capture for the best blueprint generation
      </Text>

      {/* Mode Selection */}
      <View style={styles.modesContainer}>
        {uploadModes.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[
              styles.modeCard,
              selectedMode === mode.id && styles.selectedModeCard,
            ]}
            onPress={() => handleModeSelect(mode.id)}
          >
            <View style={styles.modeHeader}>
              <Text
                style={[
                  styles.modeTitle,
                  selectedMode === mode.id && styles.selectedModeTitle,
                ]}
              >
                {mode.title}
              </Text>
              {mode.recommended && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>Recommended</Text>
                </View>
              )}
            </View>

            <Text style={styles.modeDescription}>{mode.description}</Text>

            <View style={styles.prosConsContainer}>
              <View style={styles.prosContainer}>
                <Text style={styles.prosConsTitle}>Pros:</Text>
                {mode.pros.map((pro, index) => (
                  <Text key={index} style={styles.prosText}>
                    • {pro}
                  </Text>
                ))}
              </View>

              <View style={styles.consContainer}>
                <Text style={styles.prosConsTitle}>Cons:</Text>
                {mode.cons.map((con, index) => (
                  <Text key={index} style={styles.consText}>
                    • {con}
                  </Text>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Image Preview */}
      {capturedImages.length > 0 && (
        <View style={styles.imagesContainer}>
          <Text style={styles.imagesTitle}>
            Captured Images ({capturedImages.length}/{requiredImages})
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {capturedImages.map((imageUri, index) => (
              <View key={index} style={styles.imagePreviewContainer}>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => onRemoveImage(index)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Capture Button */}
      <TouchableOpacity
        style={[
          styles.captureButton,
          canStartCapture && styles.captureButtonEnabled,
        ]}
        onPress={onStartCapture}
        disabled={!canStartCapture}
      >
        <Text
          style={[
            styles.captureButtonText,
            canStartCapture && styles.captureButtonTextEnabled,
          ]}
        >
          {capturedImages.length === 0
            ? `Start Capturing (${requiredImages} photos needed)`
            : `Capture More (${
                requiredImages - capturedImages.length
              } remaining)`}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  modesContainer: {
    marginBottom: 20,
  },
  modeCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  selectedModeCard: {
    borderColor: "#007AFF",
    backgroundColor: "#f0f8ff",
  },
  modeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  selectedModeTitle: {
    color: "#007AFF",
  },
  recommendedBadge: {
    backgroundColor: "#34C759",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  modeDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  prosConsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  prosContainer: {
    flex: 1,
    marginRight: 8,
  },
  consContainer: {
    flex: 1,
    marginLeft: 8,
  },
  prosConsTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  prosText: {
    fontSize: 12,
    color: "#34C759",
    marginBottom: 2,
  },
  consText: {
    fontSize: 12,
    color: "#FF3B30",
    marginBottom: 2,
  },
  imagesContainer: {
    marginBottom: 20,
  },
  imagesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  imagePreviewContainer: {
    position: "relative",
    marginRight: 12,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF3B30",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  captureButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  captureButtonEnabled: {
    backgroundColor: "#007AFF",
  },
  captureButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#999",
  },
  captureButtonTextEnabled: {
    color: "white",
  },
});
