import { NextRequest, NextResponse } from "next/server";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { storage } from '@/src/firebaseConfig'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const client = new TextToSpeechClient({
  apiKey: process.env.GOOGLE_API_KEY
});

// Add this to handle longer execution time
export const config = {
  maxDuration: 300
};
export async function POST(req: NextRequest) {
  try {
    const { text, id } = await req.json();
    const storageRef = ref(storage, `ai-short-video-files/${id}.mp3`);

    // Add input validation
    if (!text || !id) {
      throw new Error('Missing required parameters');
    }

    const request = {
      input: { text },
      voice: { 
        languageCode: 'en-US', 
        ssmlGender: 'MALE' as const
      },
      audioConfig: { 
        audioEncoding: 'MP3' as const
      },
    };

    const [response] = await client.synthesizeSpeech(request);

    if (!response.audioContent) {
      throw new Error('No audio content generated');
    }

    // Convert audioContent to Buffer properly
    let audioBuffer: Buffer;
    
    if (response.audioContent instanceof Buffer) {
      audioBuffer = response.audioContent;
    } else if (response.audioContent instanceof Uint8Array) {
      audioBuffer = Buffer.from(response.audioContent);
    } else {
      throw new Error('Invalid audio content format');
    }

    // Upload to Firebase Storage with retry logic
    let downloadUrl = '';
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        await uploadBytes(storageRef, audioBuffer, {
          contentType: 'audio/mp3',
          customMetadata: {
            'Cache-Control': 'public, max-age=31536000'
          }
        });
        downloadUrl = await getDownloadURL(storageRef);
        break;
      } catch (error) {
        attempt++;
        if (attempt === maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }

    return NextResponse.json({ 
      success: true,
      result: downloadUrl 
    });

  } catch (error) {
    console.error('Text-to-Speech Error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to synthesize speech'
    }, { 
      status: 500 
    });
  }

}
