import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';

class AnswerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Use text in answer field' });
    }

    const { id } = req.params;
    const { answer } = req.body;

    const helpOrder = await HelpOrder.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'age'],
        },
      ],
    });

    if (!helpOrder) {
      return res.status(400).json({ error: 'Question not registred' });
    }

    // if (helpOrder.answer_at) {
    // return res.status(400).json({ error: 'Question already answered' });
    // }

    await helpOrder.update({
      answer,
      answer_at: new Date(),
    });

    const answerMail = await HelpOrder.findByPk(id, {
      attributes: ['id', 'question', 'answer', 'created_at'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'age', 'email'],
        },
      ],
    });

    await Queue.add(AnswerMail.key, {
      answerMail,
    });

    return res.json(helpOrder);
  }
}

export default new AnswerController();
