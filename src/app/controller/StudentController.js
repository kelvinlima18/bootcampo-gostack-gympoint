import * as Yup from 'yup';
import { Op } from 'sequelize';
import Student from '../models/Student';

class StudentController {
  /* Listagem de todos os estudantes */
  async index(req, res) {
    const { name, page = 1, quantity = 20 } = req.params;

    const students = await Student.findAll({
      limit: quantity,
      offset: (page - 1) * quantity,
      where: name ? { name: { [Op.iLike]: `%${name}` } } : null,
      order: ['name'],
    });

    return res.json(students);
  }

  async show(req, res) {
    /* LIstagem de estudantes por ID */
    const { id } = req.params;

    const student = await Student.findByPk(id);

    return res.json(student);
  }

  async store(req, res) {
    /* Criação de novos estudantes */
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    const student = await Student.create(req.body);

    return res.json(student);
  }

  async update(req, res) {
    /* Atualização de dados do usuario */

    const schema = Yup.object().shape({
      nome: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Updated fails' });
    }

    const { id } = req.params;
    const { name, email, age, weight, height } = req.body;

    const student = await Student.findByPk(id);

    if (email !== student.email) {
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    await student.update({ name, email, age, weight, height });

    return res.json(student);
  }

  async delete(req, res) {
    const { id } = req.params;

    await Student.destroy({ where: { id } });

    return res.send();
  }
}

export default new StudentController();
