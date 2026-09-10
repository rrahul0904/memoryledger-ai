import { NextResponse } from "next/server";
export async function GET(){return NextResponse.json({ok:true,service:"memoryledger-web",mode:process.env.MEMORYLEDGER_DEMO_MODE!=="false"?"demo":"configured",timestamp:new Date().toISOString()})}
