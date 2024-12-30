import { NextResponse } from "next/server";
import { AssemblyAI } from "assemblyai";

export async function POST(req){
  try {
    const { audioFileUrl } = await req.json();
    const client = new AssemblyAI({
      apiKey: process.env.ASSEMBLY_API_KEY || "bbbf3d1743e745be8d83129dcbd8d685",
    });
  
    const FILE_URL = audioFileUrl;
  
    const data = {
      audio: FILE_URL,
    };
    
    const transcript = await client.transcripts.transcribe(data);
    console.log(transcript.words);
    return NextResponse.json({ 'result': transcript.words });   
  } catch (error) {
    return NextResponse.json({ 'error': error }, { status: 500 });
  }
}