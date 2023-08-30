const Availability = require('../model/availability.model');
const Candidate = require('../model/candidate.model');
const Interviewer = require('../model/interviewer.model');
const Joi = require('joi');
const { Op } = require('sequelize');


exports.create = async (req, res) => {
  const schema = Joi.object({
    candidateId: Joi.number().integer(),
    interviewerId: Joi.number().integer(),
    startDateTime: Joi.date()
      .required()
      .min(Joi.ref('$now')), // Verificar se é igual ou posterior à data atual
    endDateTime: Joi.date()
      .required()
      .greater(Joi.ref('startDateTime')), // Verificar se é maior que a startDateTime
  });

  const { error, value } = schema.validate(req.body, {
    abortEarly: false, // Para obter todos os erros de uma vez
    context: { now: new Date() }, // Enviar a data atual como contexto
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Error validating",
      data: error.details,
    });
  }

  // Verificar se a startDate e a endDate têm minutos zerados
  if (
    value.startDateTime.getMinutes() !== 0 ||
    value.endDateTime.getMinutes() !== 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid hour format",
    });
  }

  try {
    let associationModel;
    if (value.candidateId) {
      associationModel = await Candidate.findByPk(value.candidateId);
      /*  {where : {CandidateIDCandidate : value.candidateId}, StartDateTime: {
        [Op.gte]: new Date(value.startDateTime).setUTCHours(0, 0, 0, 0), // Início do dia
        [Op.lt]: new Date(value.startDateTime).setUTCHours(24, 0, 0, 0)   // Início do dia seguinte
      }})) ? true : false;
      */
    } else if (value.interviewerId) {
      associationModel = await Interviewer.findByPk(value.interviewerId);
    } else {
      return res.status(400).json({
        success: false,
        message: "Must give either candidateId or interviewerId",
      });
    }
    if (!associationModel) {
      return res.status(404).json({
        success: false,
        message: "Candidate or Interviewer not found",
      });
    }

    const newAvailability = await Availability.create({
      StartDateTime: value.startDateTime,
      EndDataTime: value.endDateTime,
    });

    if (associationModel instanceof Candidate) {
      await newAvailability.setCandidate(associationModel);
    } else if (associationModel instanceof Interviewer) {
      await newAvailability.setInterviewer(associationModel);
    }

    return res.send({
      success: true,
      message: "Availability sucessfully created",
      data: newAvailability,
    });
  } catch (error) {
    console.log("error: " + error)
    return res.status(500).json({
      success: false,
      message: "Error Creating Availability",
      data: error.message,
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const idInterviewers = req.query.interviewerid;
    const idCandidate = req.query.candidateid;
    const whereClause = {}


    if (idCandidate && idInterviewers) {
      const interviewersArray = idInterviewers.split(',').map(Number);

      // Filtrar disponibilidades de entrevistadores no mesmo dia
      const interviewerAvailability = await Availability.findAll({
        where: {
          InterviewerIDInterviewer: interviewersArray
        },
        order: [['IDAvailability', 'ASC']]
      });

      const groupedByDay = {};

      interviewerAvailability.forEach(av => {
        const dateKey = av.StartDateTime.toISOString().split('T')[0];

        if (!groupedByDay[dateKey]) {
          groupedByDay[dateKey] = [];
        }

        groupedByDay[dateKey].push(av);
      });

      const intersectedAvailability = [];

      const candidateAvailability = await Availability.findAll({
        where: {
          CandidateIDCandidate: idCandidate
        },
        order: [['IDAvailability', 'ASC']]
      });

      const uniqueDays = new Set();

      candidateAvailability.forEach(av => {
        const dateKey = av.StartDateTime.toISOString().split('T')[0];

        if (groupedByDay[dateKey]) {
          if (!uniqueDays.has(dateKey)) {
            uniqueDays.add(dateKey);

            const avList = groupedByDay[dateKey];
            const intersectedInterval = avList.reduce((intersection, av, index) => {
              if (index === 0) {
                return {
                  start: av.StartDateTime,
                  end: av.EndDataTime
                };
              }

              const start = new Date(Math.max(intersection.start, av.StartDateTime));
              const end = new Date(Math.min(intersection.end, av.EndDataTime));

              if (start < end) {
                return {
                  start,
                  end
                };
              }

              return intersection;
            }, {});

            intersectedAvailability.push({
              date: dateKey,
              startDateTime: intersectedInterval.start,
              endDateTime: intersectedInterval.end
            });
          }
        }
      });

      if (intersectedAvailability.length > 0) {
        return res.send({
          success: true,
          message: "Showing compatible availabilities",
          data: intersectedAvailability
        });
      } else {
        return res.status(404).send({
          success: false,
          message: "There was no compatible availabilities"
        });
      }
    }
    else {
      const availability = await Availability.findAll({
        where: whereClause,
        order: [['IDAvailability', 'ASC']]
      });
      return res.send({
        success: true,
        message: "Showing all availabilities",
        data: availability
      });
    }


  } catch (err) {
    console.log("error: ", err);
    return res.status(500).send({
      success: false,
      message: "Error finding availabilities."
    });
  }
};