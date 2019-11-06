import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { answerMail } = data;

    await Mail.sendMail({
      to: `${answerMail.student.name} <${answerMail.student.email}>`,
      subject: `Resposta para o seu questionamento de ID#${answerMail.id}`,
      template: 'answer',
      context: {
        id: answerMail.id,
        user: answerMail.student.name,
        question: answerMail.question,
        answer: answerMail.answer,
        created_at: format(
          parseISO(answerMail.created_at),
          "'dia' dd 'de' MMMM 'de' yyyy, 'às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new AnswerMail();
