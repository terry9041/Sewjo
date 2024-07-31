import { NextRequest, NextResponse } from 'next/server'
import { ocrSpace } from 'ocr-space-api-wrapper'
import fs from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')
  
  const allowedOrigins = ['http://localhost:3000']
  if (origin && allowedOrigins.includes(origin)) {
    const headers = new Headers({
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    })

    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers })
    }

    try {
      const formData = await req.formData()
      const file = formData.get('test') as File | null

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400, headers })
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      const filename = path.join('/tmp', file.name)
      fs.writeFileSync(filename, buffer)

      const ocrResult = await ocrSpace(filename, {
        apiKey: process.env.OCRSPACEKEY,
        language: 'eng',
        OCREngine: 2,
        isTable: true,
        detectOrientation: true,
        isOverlayRequired: false
      })

      if (!ocrResult || !ocrResult.ParsedResults || ocrResult.ParsedResults.length === 0) {
        return NextResponse.json({ error: 'OCR processing failed or returned no results' }, { status: 500, headers })
      }

      const parsedText = ocrResult.ParsedResults[0].ParsedText

      // Clean up data
      // TODO WORK WITH PARSED FOR NOW

      fs.unlinkSync(filename)

      return NextResponse.json({ success: true, data: parsedText }, { headers })
    } catch (error) {
      console.error('Error during processing:', error)
      return NextResponse.json({ error: 'An error occurred during processing' }, { status: 500, headers })
    }
  } else {
    return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })
  }
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin')
  
  const allowedOrigins = ['http://localhost:3000']
  if (origin && allowedOrigins.includes(origin)) {
    const headers = new Headers({
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    })

    return new NextResponse(null, { status: 204, headers })
  } else {
    return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })
  }
}