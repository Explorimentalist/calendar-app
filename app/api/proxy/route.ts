import { NextResponse } from 'next/server'
import axios from 'axios'
import { Resend } from 'resend'
import ConfirmationEmail from '@/app/emails/confirmation'

// Fix the Resend initialization - use proper env variable access
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Reorder the data
    const formattedBody = {
      timestamp: new Date().toISOString(), // Add current timestamp
      name: body.name,           // Reordered
      surname: body.surname,     // Reordered
      email: body.email,         // Reordered
      country: body.country,     // Reordered
      city: body.city,           // Added city
      postcode: body.postcode,   // Reordered
      address: body.address,     // Reordered
      language: body.language,   // Reordered
      quantity: body.quantity    // Reordered
    }

    // First, send data to Google Sheets as before
    const sheetsResponse = await axios.post(
      'https://script.google.com/macros/s/AKfycbw3MIoXOT1DnCcWMY_6UmLzxsREZBBjbHsztBORXBXdjXt7Tk0vAqZZPMkSW0T1YbcshA/exec',
      formattedBody
    )

    // Then, send confirmation email with better error handling
    try {
      await resend.emails.send({
        from: 'dealing__@hotmail.com', // Use Resend's default domain for now
        to: body.email,
        subject: 'Confirmación de tu pedido - Elanji Minyya',
        react: ConfirmationEmail({
          name: body.name,
          quantity: body.quantity,
          language: body.language === 'ndoweye' ? 'variantes Ndowéÿé' : 'Basèki',
          address: `${body.address}\n${body.postcode} ${body.city}\n${body.country}`
        })
      })
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Continue with the response even if email fails
    }

    return NextResponse.json(sheetsResponse.data)
  } catch (error) {
    console.error('Error in proxy:', error)
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 })
  }
}