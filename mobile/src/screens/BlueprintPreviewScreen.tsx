import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
  ActivityIndicator,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

interface BlueprintPreviewScreenProps {
  blueprintUri: string;
  measurements: {
    wallLength: string;
    ceilingHeight: string;
    unit: string;
    roomType: string;
  };
  onBack: () => void;
  onRegenerate: () => void;
}

export const BlueprintPreviewScreen: React.FC<BlueprintPreviewScreenProps> = ({
  blueprintUri,
  measurements,
  onBack,
  onRegenerate,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant permission to save images to your gallery."
        );
        return;
      }

      await MediaLibrary.saveToLibraryAsync(blueprintUri);
      Alert.alert("Success", "Blueprint saved to your gallery!");
    } catch (error) {
      console.error("Error saving blueprint:", error);
      Alert.alert("Error", "Failed to save blueprint. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);

      const result = await Share.share({
        url: blueprintUri,
        message: `Check out this room blueprint I generated! Room: ${measurements.roomType}, Dimensions: ${measurements.wallLength} x ${measurements.ceilingHeight} ${measurements.unit}`,
      });

      if (result.action === Share.sharedAction) {
        Alert.alert("Success", "Blueprint shared successfully!");
      }
    } catch (error) {
      console.error("Error sharing blueprint:", error);
      Alert.alert("Error", "Failed to share blueprint. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  const handleRegenerate = () => {
    Alert.alert(
      "Regenerate Blueprint",
      "Are you sure you want to regenerate the blueprint? This will process your images again.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Regenerate", onPress: onRegenerate },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Room Blueprint</Text>
        <Text style={styles.subtitle}>Generated from your room images</Text>
      </View>

      {/* Blueprint Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: blueprintUri }} style={styles.blueprintImage} />
      </View>

      {/* Room Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Room Details</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Room Type:</Text>
          <Text style={styles.infoValue}>{measurements.roomType}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Wall Length:</Text>
          <Text style={styles.infoValue}>
            {measurements.wallLength} {measurements.unit}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ceiling Height:</Text>
          <Text style={styles.infoValue}>
            {measurements.ceilingHeight} {measurements.unit}
          </Text>
        </View>
      </View>

      {/* Features Info */}
      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Blueprint Features</Text>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>📐</Text>
          <Text style={styles.featureText}>
            Scaled to real-world dimensions
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🏠</Text>
          <Text style={styles.featureText}>2D top-down view</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🚪</Text>
          <Text style={styles.featureText}>
            Walls, windows, and doors detected
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>📏</Text>
          <Text style={styles.featureText}>Accurate measurements</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.regenerateButton}
          onPress={handleRegenerate}
        >
          <Text style={styles.regenerateButtonText}>Regenerate</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionButtonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Text style={styles.actionButtonIcon}>💾</Text>
              <Text style={styles.actionButtonText}>Save to Gallery</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={handleShare}
          disabled={isSharing}
        >
          {isSharing ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Text style={styles.actionButtonIcon}>📤</Text>
              <Text style={styles.actionButtonText}>Share</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Tips for Better Results</Text>
        <Text style={styles.tipText}>
          • Ensure good lighting when capturing room images
        </Text>
        <Text style={styles.tipText}>
          • Capture from different angles for better depth estimation
        </Text>
        <Text style={styles.tipText}>• Keep the camera steady and level</Text>
        <Text style={styles.tipText}>
          • Include corners and walls in your photos
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  imageContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  blueprintImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  infoContainer: {
    backgroundColor: "white",
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  featuresContainer: {
    backgroundColor: "white",
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  regenerateButton: {
    flex: 1,
    backgroundColor: "#FF9500",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  regenerateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  actionButtonContainer: {
    flexDirection: "row",
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  saveButton: {
    backgroundColor: "#34C759",
  },
  shareButton: {
    backgroundColor: "#007AFF",
  },
  actionButtonIcon: {
    fontSize: 18,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  tipsContainer: {
    backgroundColor: "white",
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
    lineHeight: 20,
  },
});
