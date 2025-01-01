import { NextRequest, NextResponse } from "next/server";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { storage } from '@/src/firebaseConfig'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// Initialize with API key only
const client = new TextToSpeechClient({
  apiKey: process.env.GOOGLE_API_KEY || "AIzaSyC_LryFtohSMah4T3QMWzSEwMvUXDWPNMo"
});

export const config = {
  runtime: 'edge',
  maxDuration: 300
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let progressLog = [];

  try {
    const { text, id } = await req.json();
    
    // Input validation
    if (!text || !id) {
      throw new Error('Missing required parameters');
    }

    // Log start
    progressLog.push(`Starting audio generation for ${id} at ${new Date().toISOString()}`);

    // Split text into chunks to handle longer texts
    const MAX_CHUNK_LENGTH = 4000; // Google TTS limit
    const textChunks = text.match(new RegExp(`.{1,${MAX_CHUNK_LENGTH}}(?=\\s|$)`, 'g')) || [text];
    
    let audioBuffers: Buffer[] = [];
    
    // Process each chunk
    for (let i = 0; i < textChunks.length; i++) {
      // Check remaining time
      const timeElapsed = (Date.now() - startTime) / 1000;
      if (timeElapsed > 240) { // Leave 60s buffer
        throw new Error('Operation timeout approaching');
      }

      const chunk = textChunks[i];
      progressLog.push(`Processing chunk ${i + 1}/${textChunks.length}`);

      // Retry logic for each chunk
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          const [response] = await client.synthesizeSpeech({
            input: { text: chunk },
            voice: { 
              languageCode: 'en-US', 
              ssmlGender: 'MALE' as const
            },
            audioConfig: { 
              audioEncoding: 'MP3' as const
            },
          });

          if (!response.audioContent) {
            throw new Error('No audio content generated');
          }

          audioBuffers.push(Buffer.from(response.audioContent));
          break; // Success, exit retry loop
          
        } catch (error) {
          retryCount++;
          if (retryCount === maxRetries) throw error;
          await wait(1000 * retryCount);
          progressLog.push(`Retrying chunk ${i + 1}, attempt ${retryCount + 1}`);
        }
      }
    }

    // Combine all audio chunks
    const finalBuffer = Buffer.concat(audioBuffers);
    
    // Upload to Firebase Storage with retry
    const storageRef = ref(storage, `ai-short-video-files/${id}.mp3`);
    let downloadUrl = '';
    let uploadRetries = 0;
    const maxUploadRetries = 3;

    while (uploadRetries < maxUploadRetries) {
      try {
        await uploadBytes(storageRef, finalBuffer, {
          contentType: 'audio/mp3',
          customMetadata: {
            'Cache-Control': 'public, max-age=31536000',
            'processedAt': new Date().toISOString()
          }
        });
        downloadUrl = await getDownloadURL(storageRef);
        break;
      } catch (error) {
        uploadRetries++;
        if (uploadRetries === maxUploadRetries) throw error;
        await wait(1000 * uploadRetries);
        progressLog.push(`Retrying upload, attempt ${uploadRetries + 1}`);
      }
    }

    // Calculate total processing time
    const processingTime = (Date.now() - startTime) / 1000;
    progressLog.push(`Completed audio generation in ${processingTime.toFixed(2)}s`);

    return NextResponse.json({ 
      success: true,
      result: downloadUrl,
      processingTime,
      progressLog
    });

  } catch (error) {
    console.error('Text-to-Speech Error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to synthesize speech',
      progressLog,
      timestamp: new Date().toISOString()
    }, { 
      status: 500 
    });
  }
}

// CORS handling
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} // luckey