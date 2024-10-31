import { Html } from '@react-email/html'
import { Text } from '@react-email/text'
import { Section } from '@react-email/section'
import { Container } from '@react-email/container'

// This is like a React component, but specifically for emails
export default function ConfirmationEmail({ 
  name,
  quantity,
  language,
  address
}: {
  name: string
  quantity: string
  language: string
  address: string
}) {
  return (
    <Html>
      <Section style={styles.main}>
        <Container style={styles.container}>
          <Text style={styles.heading}>¡Gracias por tu pedido, {name}!</Text>
          <Text style={styles.paragraph}>
            Hemos recibido tu solicitud para {quantity} calendario(s) en {language}.
          </Text>
          <Text style={styles.paragraph}>
            Dirección de envío:<br />
            {address}
          </Text>
          <Text style={styles.footer}>
            Nos pondremos en contacto contigo pronto para confirmar el envío.
          </Text>
        </Container>
      </Section>
    </Html>
  )
}

// Email-safe CSS styles
const styles = {
  main: {
    backgroundColor: '#ffffff',
    fontFamily: 'Arial, sans-serif',
  },
  container: {
    margin: '0 auto',
    padding: '20px',
    maxWidth: '600px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: '#000000',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '24px',
    marginBottom: '16px',
    color: '#333333',
  },
  footer: {
    fontSize: '14px',
    color: '#666666',
    marginTop: '32px',
  },
} 