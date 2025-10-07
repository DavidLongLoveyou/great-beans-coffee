import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Mock database - in real app, this would be your database
let rfqDatabase = [
  {
    id: 'RFQ-2024-001',
    status: 'pending' as const,
    statusHistory: [
      {
        id: '1',
        status: 'pending' as const,
        timestamp: new Date('2024-01-15T10:00:00Z'),
        updatedBy: 'System',
        note: 'RFQ submitted'
      }
    ]
  }
]

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'quoted', 'accepted', 'rejected', 'expired']),
  note: z.string().optional()
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Validate request body
    const validatedData = updateStatusSchema.parse(body)
    
    // Find RFQ
    const rfqIndex = rfqDatabase.findIndex(rfq => rfq.id === id)
    if (rfqIndex === -1) {
      return NextResponse.json(
        { error: 'RFQ not found' },
        { status: 404 }
      )
    }
    
    const rfq = rfqDatabase[rfqIndex]
    const previousStatus = rfq.status
    
    // Validate status transition (basic validation)
    const allowedTransitions = {
      pending: ['processing', 'rejected'],
      processing: ['quoted', 'rejected'],
      quoted: ['accepted', 'rejected', 'expired'],
      accepted: [],
      rejected: [],
      expired: []
    }
    
    if (!allowedTransitions[previousStatus].includes(validatedData.status)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${previousStatus} to ${validatedData.status}` },
        { status: 400 }
      )
    }
    
    // Update status
    rfq.status = validatedData.status
    
    // Add to status history
    const historyEntry = {
      id: Date.now().toString(),
      status: validatedData.status,
      timestamp: new Date(),
      updatedBy: 'Admin User', // In real app, get from auth
      note: validatedData.note
    }
    
    rfq.statusHistory.push(historyEntry)
    
    // Update in "database"
    rfqDatabase[rfqIndex] = rfq
    
    return NextResponse.json({
      success: true,
      rfq: {
        id: rfq.id,
        status: rfq.status,
        statusHistory: rfq.statusHistory
      }
    })
    
  } catch (error) {
    console.error('Error updating RFQ status:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Find RFQ
    const rfq = rfqDatabase.find(rfq => rfq.id === id)
    if (!rfq) {
      return NextResponse.json(
        { error: 'RFQ not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      status: rfq.status,
      statusHistory: rfq.statusHistory
    })
    
  } catch (error) {
    console.error('Error fetching RFQ status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}