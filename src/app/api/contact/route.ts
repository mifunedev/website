import { NextResponse } from "next/server";
import AirtableApi from "../utils/airtable";
import BrevoApi from "../utils/brevo";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const airtable = new AirtableApi();
    const airRes = await airtable.create(body);
    if (!airRes.ok) {
      const errorData = await airRes.json();
      console.log(errorData);
      return new Response(errorData, {
        status: 500,
      });
    }
    

    const data = {
      'message': `Successfully Subscribed!`,
      ...(await airRes.json()),
    };
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to subscribe" }, 
      { status: 500 }
    );
  }
}