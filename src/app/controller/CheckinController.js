import { subDays, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Register from '../models/Register';
import Student from '../models/Student';
import Checkin from '../models/Checkin';

class CheckinController {
  async store(req, res) {
    const { student_id } = req.params;

    const student = await Register.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student not registred' });
    }

    const now = Number(new Date());
    const startDate = Number(subDays(now, 7));

    const lastCheckin = await Checkin.findAll({
      where: {
        student_id,
        created_at: { [Op.between]: [startOfDay(startDate), endOfDay(now)] },
      },
    });

    if (lastCheckin.length > 5) {
      return res
        .status(401)
        .json({ error: 'You have already 5 checkins in the last 7 days' });
    }

    const checkin = await Checkin.create({ student_id });

    return res.json(checkin);
  }

  async index(req, res) {
    const { student_id } = req.params;

    const checkins = await Checkin.findAll({
      where: { student_id },
      attributes: ['student_id', 'created_at'],
      order: ['created_at'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'age'],
        },
      ],
    });

    return res.json(checkins);
  }
}

export default new CheckinController();
