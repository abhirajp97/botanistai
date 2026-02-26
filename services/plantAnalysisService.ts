import { PlantAnalysis, HealthStatus } from "../types";

const AI_PROVIDER = process.env.AI_PROVIDER;

const MOCK_ANALYSES: PlantAnalysis[] = [
  {
    plantName: "Monstera Deliciosa",
    scientificName: "Monstera deliciosa",
    healthStatus: HealthStatus.HEALTHY,
    healthScore: 92,
    diagnosis: "This Monstera is thriving with vibrant, well-fenestrated leaves.",
    detailedDescription: "The plant shows excellent overall health with deep green coloration and well-developed leaf fenestrations. The leaves are firm and upright, indicating proper hydration and light exposure. No signs of pest damage, yellowing, or browning are present.",
    careInstructions: [
      "Continue watering when the top 2 inches of soil feel dry.",
      "Maintain bright, indirect light exposure.",
      "Wipe leaves monthly with a damp cloth to remove dust.",
      "Fertilize once a month during spring and summer with a balanced liquid fertilizer."
    ],
    preventativeMeasures: [
      "Avoid direct sunlight which can scorch the leaves.",
      "Ensure adequate drainage to prevent root rot.",
      "Monitor for common pests like spider mites and mealybugs.",
      "Repot every 1-2 years to refresh the soil."
    ]
  },
  {
    plantName: "Peace Lily",
    scientificName: "Spathiphyllum wallisii",
    healthStatus: HealthStatus.NEEDS_ATTENTION,
    healthScore: 58,
    diagnosis: "This Peace Lily shows signs of underwatering with drooping leaves and brown tips.",
    detailedDescription: "The plant displays characteristic wilting and leaf droop associated with insufficient watering. Several leaf tips have turned brown and crispy, which is a common indicator of low humidity or inconsistent watering. The overall structure is still intact, suggesting recovery is very achievable with adjusted care.",
    careInstructions: [
      "Water the plant thoroughly until water drains from the bottom of the pot.",
      "Increase watering frequency — check soil moisture every 2-3 days.",
      "Mist the leaves regularly or place on a pebble tray to increase humidity.",
      "Trim the brown leaf tips with clean scissors at an angle."
    ],
    preventativeMeasures: [
      "Set a consistent watering schedule.",
      "Keep away from heating vents and air conditioning drafts.",
      "Consider a self-watering pot for more consistent moisture.",
      "Group with other plants to create a more humid microenvironment."
    ]
  },
  {
    plantName: "Fiddle Leaf Fig",
    scientificName: "Ficus lyrata",
    healthStatus: HealthStatus.NEEDS_ATTENTION,
    healthScore: 65,
    diagnosis: "Brown spots on leaves suggest overwatering or inconsistent watering patterns.",
    detailedDescription: "The Fiddle Leaf Fig shows brown spots concentrated in the middle and edges of several leaves. This pattern typically indicates root stress from overwatering or poor drainage. The newer growth at the top appears healthier, suggesting the issue developed over time. No signs of bacterial infection are visible at this stage.",
    careInstructions: [
      "Allow the top inch of soil to dry completely between waterings.",
      "Check that the pot has adequate drainage holes.",
      "Remove any severely damaged leaves to redirect energy to healthy growth.",
      "Place in a bright spot with consistent, indirect light."
    ],
    preventativeMeasures: [
      "Use a moisture meter to avoid guesswork with watering.",
      "Avoid moving the plant frequently as Fiddle Leaf Figs dislike change.",
      "Use well-draining potting mix with perlite.",
      "Rotate the plant quarterly for even growth."
    ]
  },
  {
    plantName: "Basil",
    scientificName: "Ocimum basilicum",
    healthStatus: HealthStatus.HEALTHY,
    healthScore: 85,
    diagnosis: "A healthy basil plant with lush foliage, ready for harvesting.",
    detailedDescription: "This basil plant is growing vigorously with bright green, aromatic leaves. The stems are sturdy and branching well, indicating it has been properly pinched back. There are no signs of pest damage, fungal issues, or nutrient deficiencies. Some lower leaves show minor aging which is perfectly normal.",
    careInstructions: [
      "Harvest regularly by pinching off the top sets of leaves to encourage bushy growth.",
      "Water consistently, keeping soil moist but not waterlogged.",
      "Ensure at least 6 hours of direct sunlight daily.",
      "Remove any flower buds immediately to prolong leaf production."
    ],
    preventativeMeasures: [
      "Watch for aphids and Japanese beetles, common basil pests.",
      "Avoid wetting the leaves when watering to prevent fungal disease.",
      "Succession plant every 3-4 weeks for continuous harvest.",
      "Bring indoors or protect if temperatures drop below 50°F."
    ]
  },
  {
    plantName: "Snake Plant",
    scientificName: "Dracaena trifasciata",
    healthStatus: HealthStatus.CRITICAL,
    healthScore: 30,
    diagnosis: "Severe overwatering has caused root rot, with mushy base and yellowing leaves.",
    detailedDescription: "The Snake Plant shows clear signs of root rot caused by excessive moisture. The base of several leaves has become mushy and discolored, turning a dark brown or black. Yellowing is spreading upward from the base. The soil appears saturated and has a musty odor, confirming waterlogged conditions. Immediate intervention is needed to save the remaining healthy portions.",
    careInstructions: [
      "Remove the plant from its pot immediately and inspect the roots.",
      "Cut away all black, mushy, or foul-smelling roots with sterilized scissors.",
      "Allow the healthy root sections to air dry for 24 hours.",
      "Repot in fresh, dry, well-draining cactus/succulent mix.",
      "Do not water for at least one week after repotting."
    ],
    preventativeMeasures: [
      "Water Snake Plants only every 2-3 weeks, or when soil is completely dry.",
      "Use a pot with drainage holes — never let it sit in standing water.",
      "Use a gritty, fast-draining soil mix.",
      "In winter, reduce watering to once a month or less."
    ]
  }
];

function getDemoAnalysis(base64Image: string): PlantAnalysis {
  let hash = 0;
  const sample = base64Image.slice(0, 200);
  for (let i = 0; i < sample.length; i++) {
    hash = ((hash << 5) - hash + sample.charCodeAt(i)) | 0;
  }
  return MOCK_ANALYSES[Math.abs(hash) % MOCK_ANALYSES.length];
}

export function isDemoMode(): boolean {
  return !AI_PROVIDER;
}

export async function analyzePlant(base64Image: string): Promise<PlantAnalysis> {
  if (!AI_PROVIDER) {
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    return getDemoAnalysis(base64Image);
  }

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Analysis failed' }));
    throw new Error(err.error || `Analysis failed (${response.status})`);
  }

  return response.json() as Promise<PlantAnalysis>;
}
