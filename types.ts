export enum HealthStatus {
  HEALTHY = "Healthy",
  NEEDS_ATTENTION = "Needs Attention",
  CRITICAL = "Critical",
  UNKNOWN = "Unknown"
}

export interface PlantAnalysis {
  plantName: string;
  scientificName: string;
  healthStatus: HealthStatus;
  healthScore: number; // 0 to 100
  diagnosis: string; // Short summary
  detailedDescription: string; // Detailed analysis
  careInstructions: string[]; // List of steps
  preventativeMeasures: string[]; // List of future prevention tips
}

export interface HistoryItem extends PlantAnalysis {
  id: string;
  timestamp: number;
  imageUrl: string;
}