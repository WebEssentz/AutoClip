import { chatSession } from "@/src/AiModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    console.log(prompt);

    const result = await chatSession.sendMessage(prompt);
    const responseText = await result.response.text();
    console.log(responseText);

    return NextResponse.json({ 'result': JSON.parse(responseText) });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { 'error': error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}