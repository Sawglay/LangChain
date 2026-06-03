import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    // 1. Initialize the Model
    const model = new ChatOpenAI({ 
      modelName: "gpt-4o-mini", 
      temperature: 0.7 
    });

    // 2. Create a Prompt Template
    const prompt = PromptTemplate.fromTemplate(
      "You are an expert developer. Give a brief, 2-sentence architectural summary about: {topic}"
    );

    // 3. Chain them together using LCEL (LangChain Expression Language)
    const chain = prompt.pipe(model).pipe(new StringOutputParser());

    // 4. Execute the chain
    const response = await chain.invoke({ topic: topic });

    return NextResponse.json({ result: response });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}