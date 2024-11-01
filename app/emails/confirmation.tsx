import {
  Html,
  Body,
  Container,
  Text,
  Link,
  Preview,
} from '@react-email/components';

interface ConfirmationEmailProps {
  name: string;
  quantity: string;
  language: string;
  address: string;
}

export const ConfirmationEmail = ({
  name,
  quantity,
  language,
  address,
}: ConfirmationEmailProps) => {
  return (
    <Html>
      <Preview>Confirmación de tu pedido - Elanji Minyya</Preview>
      <Body>
        <Container>
          <Text>Hola {name},</Text>
          <Text>
            Gracias por tu pedido de {quantity} calendario(s) en {language}.
          </Text>
          <Text>
            Dirección de envío:
            {address}
          </Text>
          <Text>
            Nos pondremos en contacto contigo pronto para confirmar los detalles del envío.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}; 