import cv2
import numpy as np
from PIL import Image
import io
import base64
from typing import List, Tuple, Optional
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.backends.backend_agg import FigureCanvasAgg
import os
import tempfile

class RoomBlueprintProcessor:
    """
    Processes room images to generate 2D blueprints using computer vision techniques.
    """
    
    def __init__(self):
        self.temp_dir = tempfile.mkdtemp()
    
    def process_images(self, image_paths: List[str], measurements: dict) -> str:
        """
        Main processing pipeline for generating room blueprints.
        
        Args:
            image_paths: List of paths to captured room images
            measurements: Dictionary containing wall length, ceiling height, unit, room type
            
        Returns:
            Base64 encoded blueprint image
        """
        try:
            # Load and preprocess images
            processed_images = []
            for path in image_paths:
                img = self._load_image(path)
                processed_img = self._preprocess_image(img)
                processed_images.append(processed_img)
            
            # Detect room features
            room_features = self._detect_room_features(processed_images)
            
            # Generate blueprint
            blueprint = self._generate_blueprint(room_features, measurements)
            
            # Convert to base64 for API response
            blueprint_b64 = self._image_to_base64(blueprint)
            
            return blueprint_b64
            
        except Exception as e:
            print(f"Error in processing pipeline: {e}")
            # Return a placeholder blueprint on error
            return self._generate_placeholder_blueprint(measurements)
    
    def _load_image(self, path: str) -> np.ndarray:
        """Load image from file path."""
        img = cv2.imread(path)
        if img is None:
            raise ValueError(f"Could not load image from {path}")
        return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    def _preprocess_image(self, img: np.ndarray) -> np.ndarray:
        """Preprocess image for better feature detection."""
        # Resize if too large
        height, width = img.shape[:2]
        if width > 1024:
            scale = 1024 / width
            new_width = 1024
            new_height = int(height * scale)
            img = cv2.resize(img, (new_width, new_height))
        
        # Enhance contrast
        lab = cv2.cvtColor(img, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        l = clahe.apply(l)
        enhanced = cv2.merge([l, a, b])
        enhanced = cv2.cvtColor(enhanced, cv2.COLOR_LAB2RGB)
        
        return enhanced
    
    def _detect_room_features(self, images: List[np.ndarray]) -> dict:
        """
        Detect walls, corners, and other room features from images.
        This is a simplified implementation - in production, you'd use more sophisticated ML models.
        """
        features = {
            'walls': [],
            'corners': [],
            'windows': [],
            'doors': []
        }
        
        for img in images:
            # Convert to grayscale for edge detection
            gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
            
            # Detect edges using Canny
            edges = cv2.Canny(gray, 50, 150, apertureSize=3)
            
            # Detect lines using Hough transform
            lines = cv2.HoughLinesP(edges, 1, np.pi/180, threshold=100, 
                                  minLineLength=50, maxLineGap=10)
            
            if lines is not None:
                for line in lines:
                    x1, y1, x2, y2 = line[0]
                    # Filter for horizontal and vertical lines (walls)
                    angle = np.arctan2(y2 - y1, x2 - x1) * 180 / np.pi
                    if abs(angle) < 15 or abs(angle - 90) < 15 or abs(angle - 180) < 15:
                        features['walls'].append([x1, y1, x2, y2])
            
            # Detect corners using Harris corner detection
            corners = cv2.cornerHarris(gray, 2, 3, 0.04)
            corners = cv2.dilate(corners, None)
            corner_coords = np.where(corners > 0.01 * corners.max())
            features['corners'].extend(list(zip(corner_coords[1], corner_coords[0])))
        
        return features
    
    def _generate_blueprint(self, features: dict, measurements: dict) -> np.ndarray:
        """
        Generate a 2D blueprint from detected features and measurements.
        """
        # Extract measurements
        wall_length = float(measurements['wallLength'])
        ceiling_height = float(measurements['ceilingHeight'])
        unit = measurements['unit']
        room_type = measurements['roomType']
        
        # Convert to meters if needed
        if unit == 'feet':
            wall_length *= 0.3048  # feet to meters
            ceiling_height *= 0.3048
        
        # Create blueprint figure
        fig, ax = plt.subplots(1, 1, figsize=(10, 8))
        ax.set_xlim(0, wall_length)
        ax.set_ylim(0, wall_length)  # Assuming square room for simplicity
        ax.set_aspect('equal')
        
        # Draw room outline
        room_rect = patches.Rectangle((0, 0), wall_length, wall_length, 
                                    linewidth=3, edgecolor='black', facecolor='lightblue', alpha=0.3)
        ax.add_patch(room_rect)
        
        # Draw detected walls (simplified representation)
        if features['walls']:
            for wall in features['walls'][:4]:  # Limit to 4 walls for simplicity
                x1, y1, x2, y2 = wall
                # Scale and position wall on blueprint
                x1_scaled = (x1 / 1000) * wall_length  # Assuming 1000px reference
                y1_scaled = (y1 / 1000) * wall_length
                x2_scaled = (x2 / 1000) * wall_length
                y2_scaled = (y2 / 1000) * wall_length
                
                ax.plot([x1_scaled, x2_scaled], [y1_scaled, y2_scaled], 
                       'k-', linewidth=2, alpha=0.7)
        
        # Add room features
        self._add_room_features(ax, features, wall_length)
        
        # Add measurements
        self._add_measurements(ax, wall_length, ceiling_height, unit)
        
        # Add title and labels
        ax.set_title(f'{room_type} Blueprint', fontsize=16, fontweight='bold')
        ax.set_xlabel(f'Length ({unit})')
        ax.set_ylabel(f'Width ({unit})')
        ax.grid(True, alpha=0.3)
        
        # Convert to numpy array
        canvas = FigureCanvasAgg(fig)
        canvas.draw()
        buf = np.frombuffer(canvas.tostring_rgb(), dtype=np.uint8)
        buf = buf.reshape(canvas.get_width_height()[::-1] + (3,))
        
        plt.close(fig)
        return buf
    
    def _add_room_features(self, ax, features: dict, wall_length: float):
        """Add doors, windows, and other features to the blueprint."""
        # Add doors (simplified)
        if features['doors']:
            for i, door in enumerate(features['doors'][:2]):  # Max 2 doors
                door_x = (i + 1) * wall_length / 3
                door_y = 0
                door_rect = patches.Rectangle((door_x - 0.5, door_y), 1, 0.2, 
                                            facecolor='brown', alpha=0.7)
                ax.add_patch(door_rect)
                ax.text(door_x, door_y + 0.3, 'D', ha='center', va='center', fontweight='bold')
        
        # Add windows (simplified)
        if features['windows']:
            for i, window in enumerate(features['windows'][:4]):  # Max 4 windows
                window_x = (i + 1) * wall_length / 5
                window_y = wall_length
                window_rect = patches.Rectangle((window_x - 0.3, window_y - 0.1), 0.6, 0.2, 
                                              facecolor='lightblue', alpha=0.7)
                ax.add_patch(window_rect)
                ax.text(window_x, window_y + 0.3, 'W', ha='center', va='center', fontweight='bold')
    
    def _add_measurements(self, ax, wall_length: float, ceiling_height: float, unit: str):
        """Add measurement annotations to the blueprint."""
        # Add wall length measurement
        ax.annotate(f'{wall_length:.1f} {unit}', 
                   xy=(wall_length/2, -0.5), ha='center', va='top',
                   fontsize=12, fontweight='bold',
                   bbox=dict(boxstyle="round,pad=0.3", facecolor="yellow", alpha=0.7))
        
        # Add ceiling height note
        ax.text(0.1, wall_length - 0.5, f'Ceiling Height: {ceiling_height:.1f} {unit}', 
               fontsize=10, bbox=dict(boxstyle="round,pad=0.3", facecolor="lightgreen", alpha=0.7))
    
    def _generate_placeholder_blueprint(self, measurements: dict) -> str:
        """Generate a placeholder blueprint when processing fails."""
        wall_length = float(measurements['wallLength'])
        ceiling_height = float(measurements['ceilingHeight'])
        unit = measurements['unit']
        room_type = measurements['roomType']
        
        # Convert to meters if needed
        if unit == 'feet':
            wall_length *= 0.3048
            ceiling_height *= 0.3048
        
        fig, ax = plt.subplots(1, 1, figsize=(10, 8))
        ax.set_xlim(0, wall_length)
        ax.set_ylim(0, wall_length)
        ax.set_aspect('equal')
        
        # Draw simple room outline
        room_rect = patches.Rectangle((0, 0), wall_length, wall_length, 
                                    linewidth=3, edgecolor='black', facecolor='lightblue', alpha=0.3)
        ax.add_patch(room_rect)
        
        # Add title
        ax.set_title(f'{room_type} Blueprint (Placeholder)', fontsize=16, fontweight='bold')
        ax.set_xlabel(f'Length ({unit})')
        ax.set_ylabel(f'Width ({unit})')
        ax.grid(True, alpha=0.3)
        
        # Add measurements
        ax.annotate(f'{wall_length:.1f} {unit}', 
                   xy=(wall_length/2, -0.5), ha='center', va='top',
                   fontsize=12, fontweight='bold')
        
        # Convert to base64
        canvas = FigureCanvasAgg(fig)
        canvas.draw()
        buf = np.frombuffer(canvas.tostring_rgb(), dtype=np.uint8)
        buf = buf.reshape(canvas.get_width_height()[::-1] + (3,))
        
        plt.close(fig)
        return self._image_to_base64(buf)
    
    def _image_to_base64(self, img: np.ndarray) -> str:
        """Convert numpy array image to base64 string."""
        img_pil = Image.fromarray(img)
        buffer = io.BytesIO()
        img_pil.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        return f"data:image/png;base64,{img_str}"
    
    def cleanup(self):
        """Clean up temporary files."""
        import shutil
        if os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)
