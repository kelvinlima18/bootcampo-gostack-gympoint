import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegisterMail {
  get key() {
    return 'RegisterMail';
  }

  async handle({ data }) {
    const { registerMail } = data;

    await Mail.sendMail({
      to: `${registerMail.student.name} <${registerMail.student.email}>`,
      subject: 'Bem-Vindo a Gympoint!!!',
      template: 'register',
      context: {
        user: registerMail.student.name,
        title: registerMail.plan.title,
        start_date: format(
          parseISO(registerMail.start_date),
          "'dia' dd 'de' MMMM 'de' yyyy ', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        end_date: format(
          parseISO(registerMail.end_date),
          "'dia' dd 'de' MMMM 'de' yyyy', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        price: registerMail.plan.price,
        total_price: registerMail.price,
      },
    });
  }
}

export default new RegisterMail();
