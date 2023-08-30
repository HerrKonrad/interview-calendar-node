const Interviewer = require("../model/interviewer.model")

const Joi = require("joi")

exports.create = async (req, res) => {
  // Validar os dados do request usando Joi
  const schema = Joi.object({
    Name: Joi.string().min(3).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Erro de validação",
      data: error.details
    });
  }

  try {
    // Criar novo candidato na base de dados
    const newInterviewer = await Interviewer.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Candidato criado com sucesso",
      data: newInterviewer
    });
  } catch (error) {
    console.log("Error creating interviewer: " + error)
    return res.status(500).json({
      success: false,
      message: "Erro ao criar candidato",
      data: error.message
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const idInterviewer = req.params.idinterviewer
    const interviewer = await Interviewer.findByPk(idInterviewer);
    if (interviewer) {
      return res.send({
        success: true,
        data: interviewer,
        message: "Interviewer found"
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "Interviewer not found",
        data: {}
      });
    }
  } catch (err) {
    console.log("Error findind interviewer: ", err);
    return res.status(500).send({
      success: false,
      message: "Error finding interviewer.",
      data: err.details
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const interviewer = await Interviewer.findAll({
      order: [['IDInterviewer', 'ASC']]
    });
    return res.send({
      success: true,
      data: interviewer,
      message: "Showing all interviewers"
    });
  } catch (err) {
    console.log("error: ", err);
    return res.status(500).send({
      success: false,
      message: "Error finding interviewers.",
      data: err.details
    });
  }
};

exports.update = async (req, res) => {
  const idinterviewer = req.params.idinterviewer;

  try {
    // Recupere o candidato da base de dados
    const interviewer = await Interviewer.findByPk(idinterviewer);

    if (!interviewer) {
      return res.status(404).json({
        success: false,
        message: "Interviewer not found"
      });
    }

    const schema = Joi.object({
      Name: Joi.string().min(3)
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Error validation",
        data: error.details
      });
    }


    // Atualize o nome do candidato e salve as mudanças
    interviewer.Name = req.body.Name;
    await interviewer.save();

    res.json({
      success: true,
      message: "Interviewer updated successfully",
      data: interviewer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating interviewer",
      data: error.message
    });
  }
};

exports.delete = async (req, res) => {
  const idinterviewer = req.params.idinterviewer;
  try {
    const interviewer = await Interviewer.findByPk(idinterviewer);
    if (!interviewer) {
      return res.status(404).send({
        success: false,
        message: "Interviewer not found"
      });
    } else {
      await interviewer.destroy();
      return res.status(200).send({
        success: true,
        message: `Interviewer deleted`
      });
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error deleting interviewer",
      data: err.details
    });
  }
};