import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

export interface MeasurementData {
  wallLength: string;
  ceilingHeight: string;
  unit: "meters" | "feet";
  roomType: string;
  additionalNotes: string;
}

interface MeasurementFormProps {
  onSubmit: (data: MeasurementData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const MeasurementForm: React.FC<MeasurementFormProps> = ({
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const [measurements, setMeasurements] = useState<MeasurementData>({
    wallLength: "",
    ceilingHeight: "",
    unit: "meters",
    roomType: "",
    additionalNotes: "",
  });

  const [errors, setErrors] = useState<Partial<MeasurementData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<MeasurementData> = {};

    if (!measurements.wallLength.trim()) {
      newErrors.wallLength = "Wall length is required";
    } else {
      const length = parseFloat(measurements.wallLength);
      if (isNaN(length) || length <= 0) {
        newErrors.wallLength = "Please enter a valid positive number";
      }
    }

    if (!measurements.ceilingHeight.trim()) {
      newErrors.ceilingHeight = "Ceiling height is required";
    } else {
      const height = parseFloat(measurements.ceilingHeight);
      if (isNaN(height) || height <= 0) {
        newErrors.ceilingHeight = "Please enter a valid positive number";
      }
    }

    if (!measurements.roomType.trim()) {
      newErrors.roomType = "Room type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(measurements);
    }
  };

  const updateMeasurement = (field: keyof MeasurementData, value: string) => {
    setMeasurements((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleUnit = () => {
    setMeasurements((prev) => ({
      ...prev,
      unit: prev.unit === "meters" ? "feet" : "meters",
    }));
  };

  const roomTypes = [
    "Living Room",
    "Bedroom",
    "Kitchen",
    "Bathroom",
    "Office",
    "Dining Room",
    "Other",
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Room Measurements</Text>
      <Text style={styles.subtitle}>
        Provide basic measurements to scale your blueprint accurately
      </Text>

      {/* Unit Toggle */}
      <View style={styles.unitToggleContainer}>
        <Text style={styles.unitLabel}>Unit of Measurement:</Text>
        <View style={styles.unitToggle}>
          <TouchableOpacity
            style={[
              styles.unitButton,
              measurements.unit === "meters" && styles.unitButtonActive,
            ]}
            onPress={() => updateMeasurement("unit", "meters")}
          >
            <Text
              style={[
                styles.unitButtonText,
                measurements.unit === "meters" && styles.unitButtonTextActive,
              ]}
            >
              Meters
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.unitButton,
              measurements.unit === "feet" && styles.unitButtonActive,
            ]}
            onPress={() => updateMeasurement("unit", "feet")}
          >
            <Text
              style={[
                styles.unitButtonText,
                measurements.unit === "feet" && styles.unitButtonTextActive,
              ]}
            >
              Feet
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Wall Length */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Wall Length ({measurements.unit})</Text>
        <TextInput
          style={[styles.input, errors.wallLength && styles.inputError]}
          value={measurements.wallLength}
          onChangeText={(value) => updateMeasurement("wallLength", value)}
          placeholder={`Enter wall length in ${measurements.unit}`}
          keyboardType="numeric"
        />
        {errors.wallLength && (
          <Text style={styles.errorText}>{errors.wallLength}</Text>
        )}
      </View>

      {/* Ceiling Height */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          Ceiling Height ({measurements.unit})
        </Text>
        <TextInput
          style={[styles.input, errors.ceilingHeight && styles.inputError]}
          value={measurements.ceilingHeight}
          onChangeText={(value) => updateMeasurement("ceilingHeight", value)}
          placeholder={`Enter ceiling height in ${measurements.unit}`}
          keyboardType="numeric"
        />
        {errors.ceilingHeight && (
          <Text style={styles.errorText}>{errors.ceilingHeight}</Text>
        )}
      </View>

      {/* Room Type */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Room Type</Text>
        <View style={styles.roomTypeContainer}>
          {roomTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.roomTypeButton,
                measurements.roomType === type && styles.roomTypeButtonActive,
              ]}
              onPress={() => updateMeasurement("roomType", type)}
            >
              <Text
                style={[
                  styles.roomTypeButtonText,
                  measurements.roomType === type &&
                    styles.roomTypeButtonTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.roomType && (
          <Text style={styles.errorText}>{errors.roomType}</Text>
        )}
      </View>

      {/* Additional Notes */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Additional Notes (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={measurements.additionalNotes}
          onChangeText={(value) => updateMeasurement("additionalNotes", value)}
          placeholder="Any additional information about the room..."
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? "Processing..." : "Generate Blueprint"}
          </Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 24,
  },
  unitToggleContainer: {
    marginBottom: 20,
  },
  unitLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  unitToggle: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    padding: 4,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  unitButtonActive: {
    backgroundColor: "#007AFF",
  },
  unitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  unitButtonTextActive: {
    color: "white",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginTop: 4,
  },
  roomTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  roomTypeButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  roomTypeButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  roomTypeButtonText: {
    fontSize: 14,
    color: "#666",
  },
  roomTypeButtonTextActive: {
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 40,
  },
  backButton: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  submitButton: {
    flex: 2,
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
