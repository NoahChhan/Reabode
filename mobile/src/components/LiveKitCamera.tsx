import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

interface LiveKitCameraProps {
  onImageCaptured: (imageUri: string) => void;
  onError: (error: string) => void;
}

const { width, height } = Dimensions.get("window");

export const LiveKitCamera: React.FC<LiveKitCameraProps> = ({
  onImageCaptured,
  onError,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraType, setCameraType] = useState<"back" | "front">("back");
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const hasPermission = permission?.granted;

  const captureImage = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });

      if (photo?.uri) {
        // Save to media library
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
          await MediaLibrary.saveToLibraryAsync(photo.uri);
        }

        // Call the callback with the image URI
        onImageCaptured(photo.uri);
      }
    } catch (error) {
      console.error("Error capturing image:", error);
      onError("Failed to capture image. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  const toggleCameraType = () => {
    setCameraType(cameraType === "back" ? "front" : "back");
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={cameraType} ref={cameraRef}>
        <View style={styles.cameraOverlay}>
          <View style={styles.topControls}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraType}
            >
              <Text style={styles.flipButtonText}>Flip</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={[
                styles.captureButton,
                isCapturing && styles.capturingButton,
              ]}
              onPress={captureImage}
              disabled={isCapturing}
            >
              <Text style={styles.captureButtonText}>
                {isCapturing ? "Capturing..." : "Capture"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
    paddingTop: 50,
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
    paddingBottom: 50,
  },
  flipButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  flipButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  captureButton: {
    backgroundColor: "#007AFF",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "white",
  },
  capturingButton: {
    backgroundColor: "#FF3B30",
  },
  captureButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
