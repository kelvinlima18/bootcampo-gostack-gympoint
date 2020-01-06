import * as Yup from 'yup';
import { parseISO, startOfHour, isBefore, addMonths } from 'date-fns';
import Register from '../models/Register';
import Student from '../models/Student';
import Plan from '../models/Plan';

import RegisterMail from '../jobs/RegisterMail';
import Queue from '../../lib/Queue';

class RegisterController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(401).json({ error: 'Unregistered student' });
    }

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(401).json({ error: 'This plan does not exist' });
    }

    const startDate = startOfHour(parseISO(start_date));

    if (isBefore(startDate, new Date())) {
      return res.status(401).json({ error: 'Past dates are not permitted' });
    }

    const end_date = addMonths(startDate, plan.duration);
    const price = plan.duration * plan.price;

    const registers = await Register.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    const registerMail = await Register.findByPk(registers.id, {
      attributes: ['start_date', 'end_date', 'price'],
      include: [
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'price'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    await Queue.add(RegisterMail.key, {
      registerMail,
    });

    return res.json(registers);
  }

  async index(req, res) {
    const registers = await Register.findAll({
      attributes: [
        'id',
        'student_id',
        'start_date',
        'end_date',
        'price',
        'plan_id',
        'active',
      ],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'age'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration', 'price'],
        },
      ],
    });

    return res.json(registers);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { id } = req.params;
    const { student_id, start_date, plan_id } = req.body;

    const register = await Register.findByPk(id);

    if (!register) {
      return res.status(401).json({ error: 'Student not registredq' });
    }

    const student = await Register.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(401).json({ error: 'This plan does not exist' });
    }

    const startDate = startOfHour(parseISO(start_date));

    if (isBefore(startDate, new Date())) {
      return res.status(401).json({ error: 'Past dates are not permitted' });
    }

    const end_date = addMonths(startDate, plan.duration);
    const price = plan.duration * plan.price;

    await register.update({
      plan_id,
      start_date,
      end_date,
      price,
    });

    return res.json(register);
  }

  async delete(req, res) {
    const { id } = req.params;

    await Register.destroy({ where: { id } });

    return res.send();
  }

  async show(req, res) {
    /* LIstagem de planos por ID */
    const { id } = req.params;

    const register = await Register.findByPk(id, {
      attributes: [
        'id',
        'student_id',
        'start_date',
        'end_date',
        'price',
        'plan_id',
        'active',
      ],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'age'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration', 'price'],
        },
      ],
    });

    return res.json(register);
  }
}

export default new RegisterController();
