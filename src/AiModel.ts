const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "Write a script to generate a 30 seconds video on topic: Interesting historical story along with AI image prompts in Realistic format for each scene and give me result in JSON format with imagePrompt and ContentText as field"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n[\n  {\n    \"imagePrompt\": \"Realistic image of a bustling 1920s speakeasy, dimly lit with jazz musicians playing, people laughing and dancing, shadows stretching across the room.  Focus on a clandestine meeting happening in a secluded booth.\",\n    \"ContentText\": \"The year is 1926. Prohibition is in full swing. In the heart of Chicago, a secret speakeasy thrives.  This wasn't just any bar; it was a hub for a daring plan...\"\n  },\n  {\n    \"imagePrompt\": \"Realistic image of Al Capone, sharply dressed, sitting at a mahogany desk in his opulent office, looking shrewd and calculating, with a stack of cash and a newspaper headline mentioning a rival gang in the background.\",\n    \"ContentText\": \"Al Capone, notorious gangster, ruled the city with an iron fist. But even Capone had rivals, and one in particular was threatening his empire.\"\n  },\n  {\n    \"imagePrompt\": \"Realistic image of a tense meeting in a dark alleyway at night. Two figures, one resembling a police officer in plain clothes, the other a nervous-looking informant, exchanging a briefcase. Rain is falling.\",\n    \"ContentText\": \"A daring plan was hatched. A corrupt police officer, secretly working against Capone, needed a way in.  His informant, a former Capone associate, held the key.\"\n  },\n  {\n    \"imagePrompt\": \"Realistic image of a police raid on a warehouse, officers swarming in, with crates of illegal liquor and surprised gangsters scrambling to escape. Chaos and confusion reign.\",\n    \"ContentText\": \"The informant provided the location of Capone's main liquor warehouse. The raid was swift and decisive, a stunning blow to Capone's operation.\"\n  },\n  {\n    \"imagePrompt\": \"Realistic image of newspaper headlines proclaiming the success of the raid and Capone's losses, with a picture of a triumphant police officer.\",\n    \"ContentText\": \"The raid was a major victory. Capone's power was weakened, though he would continue to be a force for years to come. This bold operation showed that even the most powerful criminals could be brought down.\"\n  }\n]\n```\n\n**Explanation:**\n\nThis JSON provides five scenes for a 30-second video about a fictionalized account of a raid on Al Capone's operation. Each scene has a detailed image prompt designed to generate realistic visuals using an AI image generator (like Midjourney, DALL-E 2, Stable Diffusion) and accompanying text for narration or on-screen subtitles.  To make a 30-second video, you would need to allocate approximately 6 seconds per scene.  This might require some editing to ensure the pacing works smoothly.  Remember that the realism of the AI generated images depends on the capabilities of the AI model used.\n"},
        ],
      },
    ],
  });
