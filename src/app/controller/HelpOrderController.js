import * as Yup from 'yup';
import Register from '../models/Register';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const answer = await HelpOrder.findAll({
      where: { answer: null },
      order: ['created_at'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'age'],
        },
      ],
    });

    return res.json(answer);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id } = req.params;
    const { question } = req.body;

    const register = await Register.findByPk(student_id);

    if (!register) {
      return res.status(400).json({ error: 'Student not registred' });
    }

    const helpOrder = await HelpOrder.create({
      student_id,
      question,
    });

    return res.json(helpOrder);
  }

  async show(req, res) {
    const { student_id } = req.params;

    if (!student_id) {
      return res.status(400).json({ error: 'Student not registred' });
    }

    const questions = await HelpOrder.findAll({
      where: { student_id },
      order: ['created_at'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'age'],
        },
      ],
    });

    return res.json(questions);
  }
}

export default new HelpOrderController();
