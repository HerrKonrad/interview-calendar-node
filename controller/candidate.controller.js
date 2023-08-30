const Candidate = require("../model/candidate.model")

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
    const newCandidate = await Candidate.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Candidato criado com sucesso",
      data: newCandidate
    });
  } catch (error) {
    console.log("Error creating candidate: " + error)
    return res.status(500).json({
      success: false,
      message: "Erro ao criar candidato",
      data: error.message
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const idCandidate = req.params.idcandidate
    const candidate = await Candidate.findByPk(idCandidate);
    if (candidate) {
      return res.send({
        success: true,
        data: candidate,
        message: "Candidate found"
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "Candidate not found",
        data: {}
      });
    }
  } catch (err) {
    console.log("Error findind candidate: ", err);
    return res.status(500).send({
      success: false,
      message: "Error finding candidate.",
      data: err.details
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const candidate = await Candidate.findAll({
      order: [['IDCandidate', 'ASC']]
    });
    return res.send({
      success: true,
      data: candidate,
      message: "Showing all candidates"
    });
  } catch (err) {
    console.log("error: ", err);
    return res.status(500).send({
      success: false,
      message: "Error finding candidates.",
      data: err.details
    });
  }
};

exports.update = async (req, res) => {
  const idcandidate = req.params.idcandidate;

  try {
    // Recupere o candidato da base de dados
    const candidate = await Candidate.findByPk(idcandidate);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found"
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
    candidate.Name = req.body.Name;
    await candidate.save();

    res.json({
      success: true,
      message: "Candidate updated successfully",
      data: candidate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating candidate",
      data: error.message
    });
  }
};

exports.delete = async (req, res) => {
  const idcandidate = req.params.idcandidate;
  try {
    const candidate = await Candidate.findByPk(idcandidate);
    if (!candidate) {
      return res.status(404).send({
        success: false,
        message: "Candidate not found"
      });
    } else {
      await candidate.destroy();
      return res.status(200).send({
        success: true,
        message: `Candidate deleted`
      });
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error deleting candidate",
      data: err.details
    });
  }
};