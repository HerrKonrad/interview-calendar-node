const request = require('supertest');
const app = require('../index'); // Substitua pelo caminho correto para o seu arquivo index.js
const Candidate = require('../model/candidate.model');
const moment = require('moment');

describe('Candidate API', () => {
  let IDCandidateCreated;
  const candidate = {
    Name : 'John Doe'
  }
  test('Must create a new candidate', async () => {

   
    const response = await request(app)
      .post('/api/candidate')
      .send(candidate)
      .set('Accept', 'application/json')
 

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Candidato criado com sucesso");
    expect(response.body.data).toHaveProperty("IDCandidate");
    expect(response.body.data).toHaveProperty("Name", candidate.Name);

    IDCandidateCreated = response.body.data.IDCandidate

    // Certifique-se de que o candidato foi realmente criado no banco de dados
    const createdCandidate = await Candidate.findByPk(response.body.data.IDCandidate);
    expect(createdCandidate).toBeTruthy();
  });

  test('Must deal with a invalid requisition (name missing)', async () => {
    const response = await request(app)
      .post('/api/candidate') // Substitua pela rota correta
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Erro de validação");
  });

  
  test('Must search a candidate by ID', async () => {
    // Crie um candidato de exemplo no banco de dados para testar a busca
   

    const response = await request(app)
      .get(`/api/candidate/${IDCandidateCreated}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("IDCandidate", IDCandidateCreated);
    expect(response.body.data).toHaveProperty("Name", candidate.Name);
  });

  test('Must return 404 for the ID of non existant candidate', async () => {
    const nonExistentId = 999; // ID que não existe no banco de dados

    const response = await request(app)
      .get(`/api/candidate/${nonExistentId}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Candidate not found");
  });

  test('Must search all candidate', async () => {
    // Crie alguns candidatos de exemplo no banco de dados para testar a busca
    
    const response = await request(app)
      .get('/api/candidate')
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('Must update a candidate', async () => {
    const updatedName = 'Jane Smith';

    const response = await request(app)
      .put(`/api/candidate/${IDCandidateCreated}`)
      .send({ Name: updatedName })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Candidate updated successfully");
    expect(response.body.data).toHaveProperty("IDCandidate", IDCandidateCreated);
    expect(response.body.data).toHaveProperty("Name", updatedName);
  });

  test('Must deal with invalid requisition during update', async () => {
    const response = await request(app)
      .put(`/api/candidate/${IDCandidateCreated}`)
      .send({ Name: 'J' }) // Nome inválido
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Error validation");
  });

  test('Must deal with trying to update a non existant candidate', async () => {
    const nonExistentId = 999; // ID que não existe no banco de dados

    const response = await request(app)
      .put(`/api/candidate/${nonExistentId}`)
      .send({ Name: 'New Name' }) // Novo nome para atualização
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Candidate not found");
  });
  
  test('Deve excluir um candidato', async () => {
    const response = await request(app)
      .delete(`/api/candidate/${IDCandidateCreated}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Candidate deleted");
  });

  test('Must return 404 for deleting a non existant candidate', async () => {
    const nonExistentId = 999; // ID que não existe no banco de dados

    const response = await request(app)
      .delete(`/api/candidate/${nonExistentId}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Candidate not found");
  });

});

const Interviewer = require('../model/interviewer.model');

describe('Interviewer API', () => {
  let IDInterviewerCreated;
  const interviewer = {
    Name : 'John Doe'
  }
  test('Must create a new interviewer', async () => {

   
    const response = await request(app)
      .post('/api/interviewer')
      .send(interviewer)
      .set('Accept', 'application/json')
 

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Candidato criado com sucesso");
    expect(response.body.data).toHaveProperty("IDInterviewer");
    expect(response.body.data).toHaveProperty("Name", interviewer.Name);

    IDInterviewerCreated = response.body.data.IDInterviewer

    // Certifique-se de que o candidato foi realmente criado no banco de dados
    const createdInterviewer = await Interviewer.findByPk(response.body.data.IDInterviewer);
    expect(createdInterviewer).toBeTruthy();
  });

  test('Must deal with a invalid requisition (name missing)', async () => {
    const response = await request(app)
      .post('/api/interviewer') // Substitua pela rota correta
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Erro de validação");
  });

  
  test('Must search a interviewer by ID', async () => {
    // Crie um candidato de exemplo no banco de dados para testar a busca
   

    const response = await request(app)
      .get(`/api/interviewer/${IDInterviewerCreated}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("IDInterviewer", IDInterviewerCreated);
    expect(response.body.data).toHaveProperty("Name", interviewer.Name);
  });

  test('Must return 404 for the ID of non existant interviewer', async () => {
    const nonExistentId = 999; // ID que não existe no banco de dados

    const response = await request(app)
      .get(`/api/interviewer/${nonExistentId}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Interviewer not found");
  });

  test('Must search all interviewer', async () => {
    // Crie alguns candidatos de exemplo no banco de dados para testar a busca
    
    const response = await request(app)
      .get('/api/interviewer')
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('Must update a interviewer', async () => {
    const updatedName = 'Jane Smith';

    const response = await request(app)
      .put(`/api/interviewer/${IDInterviewerCreated}`)
      .send({ Name: updatedName })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Interviewer updated successfully");
    expect(response.body.data).toHaveProperty("IDInterviewer", IDInterviewerCreated);
    expect(response.body.data).toHaveProperty("Name", updatedName);
  });

  test('Must deal with invalid requisition during update', async () => {
    const response = await request(app)
      .put(`/api/interviewer/${IDInterviewerCreated}`)
      .send({ Name: 'J' }) // Nome inválido
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Error validation");
  });

  test('Must deal with trying to update a non existant interviewer', async () => {
    const nonExistentId = 999; // ID que não existe no banco de dados

    const response = await request(app)
      .put(`/api/interviewer/${nonExistentId}`)
      .send({ Name: 'New Name' }) // Novo nome para atualização
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Interviewer not found");
  });
  
  test('Deve excluir um candidato', async () => {
    const response = await request(app)
      .delete(`/api/interviewer/${IDInterviewerCreated}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Interviewer deleted");
  });

  test('Must return 404 for deleting a non existant interviewer', async () => {
    const nonExistentId = 999; // ID que não existe no banco de dados

    const response = await request(app)
      .delete(`/api/interviewer/${nonExistentId}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Interviewer not found");
  });
})

const Availability = require("../model/availability.model")

describe('Availability API', () => {
  const candidate = {
    Name: 'Thomas',
  };

  const interviewer = {
    Name: 'Leonardo',
  };

  let candidateId;
  let interviewerId;

  beforeAll(async () => {
    const responseCandidate = await request(app)
      .post('/api/candidate')
      .send(candidate);

    const responseInterviewer = await request(app)
      .post('/api/interviewer')
      .send(interviewer);

    candidateId = responseCandidate.body.data.IDCandidate;
    interviewerId = responseInterviewer.body.data.IDInterviewer;
  });

  test('Deve criar uma nova Availability para um Candidate', async () => {
    const newAvailability = {
      candidateId: candidateId,
      startDateTime: moment().add(1, 'days').hour(10).minute(0).toDate(),
      endDateTime: moment().add(1, 'days').hour(12).minute(0).toDate(),
    };

    console.log("Data Inicio: " + moment().add(1, 'days').hour(10).minute(0).toDate())

    const response = await request(app)
      .post('/api/availability')
      .send(newAvailability)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    //expect(response.body.message).toBe("Availability criado com sucesso");
    expect(response.body.data).toHaveProperty("IDAvailability");
  });

  test('Deve criar uma nova Availability para um Interviewer', async () => {
    const newAvailability = {
      interviewerId: interviewerId,
      startDateTime: moment().add(2, 'days').hour(14).minute(0).toDate(),
      endDateTime: moment().add(2, 'days').hour(16).minute(0).toDate(),
    };

    const response = await request(app)
      .post('/api/availability')
      .send(newAvailability)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    //expect(response.body.message).toBe("Availability criado com sucesso");
    expect(response.body.data).toHaveProperty("IDAvailability");
  });

  test('Deve lidar com requisição inválida (horário com minutos não zerados)', async () => {
    const newAvailability = {
      candidateId: candidateId,
      startDateTime: moment().add(3, 'days').hour(9).minute(30).toDate(),
      endDateTime: moment().add(3, 'days').hour(11).minute(0).toDate(),
    };

    const response = await request(app)
      .post('/api/availability')
      .send(newAvailability)
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
   // expect(response.body.message).toBe("Invalid hour format");
  });

  test('Deve lidar com requisição inválida (data atual)', async () => {
    const newAvailability = {
      candidateId: candidateId,
      startDateTime: new Date(),
      endDateTime: moment().add(4, 'days').hour(10).minute(0).toDate(),
    };

    const response = await request(app)
      .post('/api/availability')
      .send(newAvailability)
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
   // expect(response.body.message).toBe("A startDate deve ser igual ou posterior à data atual");
  });

  test('Deve lidar com requisição inválida (startDate após endDate)', async () => {
    const newAvailability = {
      interviewerId: interviewerId,
      startDateTime: moment().add(5, 'days').hour(14).minute(0).toDate(),
      endDateTime: moment().add(5, 'days').hour(12).minute(0).toDate(),
    };

    const response = await request(app)
      .post('/api/availability')
      .send(newAvailability)
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    //expect(response.body.message).toBe("A startDate deve ser antes da endDate");
  });

  test('Deve lidar com requisição inválida (candidateId e interviewerId faltando)', async () => {
    const newAvailability = {
      startDateTime: moment().add(6, 'days').hour(10).minute(0).toDate(),
      endDateTime: moment().add(6, 'days').hour(12).minute(0).toDate(),
    };

    const response = await request(app)
      .post('/api/availability')
      .send(newAvailability)
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
   // expect(response.body.message).toBe("Must give either candidateId or interviewerId");
  });

  test('Deve lidar com requisição inválida (candidateId inválido)', async () => {
    const newAvailability = {
      candidateId: 999, // Candidate ID inválido
      startDateTime: moment().add(7, 'days').hour(10).minute(0).toDate(),
      endDateTime: moment().add(7, 'days').hour(12).minute(0).toDate(),
    };

    const response = await request(app)
      .post('/api/availability')
      .send(newAvailability)
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    //expect(response.body.message).toBe("Candidate or Interviewer not found");
  });

  test('Deve lidar com requisição inválida (interviewerId inválido)', async () => {
    const newAvailability = {
      interviewerId: 999, // Interviewer ID inválido
      startDateTime: moment().add(8, 'days').hour(14).minute(0).toDate(),
      endDateTime: moment().add(8, 'days').hour(16).minute(0).toDate(),
    };

    const response = await request(app)
      .post('/api/availability')
      .send(newAvailability)
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    //expect(response.body.message).toBe("Candidate or Interviewer not found");
  })

  
  });

  function areTimeIntervalsIntersecting(interval1Start, interval1End, interval2Start, interval2End) {
    return interval1Start <= interval2End && interval1End >= interval2Start;
  }

  describe('Compatible Availability', () => {
    let candidateId;
    let interviewerIds;
    let availabilityId1;
    let availabilityId2;
  
    beforeAll(async () => {
      // Crie um candidato e dois entrevistadores no banco de dados
      const candidateResponse = await request(app)
        .post('/api/candidate')
        .send({ Name: 'John Doe' });
      candidateId = candidateResponse.body.data.IDCandidate;
  
      const interviewerResponse1 = await request(app)
        .post('/api/interviewer')
        .send({ Name: 'Interviewer 1' });
      const interviewerResponse2 = await request(app)
        .post('/api/interviewer')
        .send({ Name: 'Interviewer 2' });
      const interviewerResponse3 = await request(app)
        .post('/api/interviewer')
        .send({ Name: 'Interviewer 3' });

      interviewerIds = [
        interviewerResponse1.body.data.IDInterviewer,
        interviewerResponse2.body.data.IDInterviewer,
        interviewerResponse3.body.data.IDInterviewer,
      ];
  
      // Crie duas disponibilidades para o candidato e cada entrevistador
      const availabilityResponse1 = await request(app)
        .post('/api/availability')
        .send({
          candidateId,
          startDateTime: '2090-08-30T07:00:00Z',
          endDateTime: '2090-08-30T09:00:00Z',
        });
      const availabilityResponse2 = await request(app)
        .post('/api/availability')
        .send({
          candidateId,
          startDateTime: '2090-08-30T08:00:00Z',
          endDateTime: '2090-08-30T10:00:00Z',
        });
        const availabilityResponse3 = await request(app)
        .post('/api/availability')
        .send({
          candidateId,
          startDateTime: '2090-09-20T16:00:00Z',
          endDateTime: '2090-09-20T20:00:00Z',
        });
      availabilityId1 = availabilityResponse1.body.data.IDAvailability;
      availabilityId2 = availabilityResponse2.body.data.IDAvailability;
  
      await request(app)
        .post(`/api/availability`)
        .send({
          interviewerId: interviewerIds[0],
          startDateTime: '2090-08-30T08:00:00Z',
          endDateTime: '2090-08-30T09:00:00Z',
        });
      await request(app)
        .post(`/api/availability`)
        .send({
          interviewerId: interviewerIds[0],
          startDateTime: '2090-08-30T09:00:00Z',
          endDateTime: '2090-08-30T10:00:00Z',
        });
      await request(app)
        .post(`/api/availability`)
        .send({
          interviewerId: interviewerIds[1],
          startDateTime: '2090-08-30T07:00:00Z',
          endDateTime: '2090-08-30T08:00:00Z',
        });
      await request(app)
        .post(`/api/availability`)
        .send({
          interviewerId: interviewerIds[1],
          startDateTime: '2090-08-30T08:00:00Z',
          endDateTime: '2090-08-30T09:00:00Z',
        });
        await request(app)
        .post(`/api/availability`)
        .send({
          interviewerId: interviewerIds[1],
          startDateTime: '2090-09-20T17:00:00Z',
          endDateTime: '2090-09-20T20:00:00Z',
        });
        await request(app)
        .post(`/api/availability`)
        .send({
          interviewerId: interviewerIds[2],
          startDateTime: '2090-04-20T20:00:00Z',
          endDateTime: '2090-04-20T22:00:00Z',
        });
    });
   
    test('Deve buscar disponibilidades compatíveis com um candidato e vários entrevistadores', async () => {
      let interviewerIdsString = interviewerIds.join(',')
      const response = await request(app).get(
        `/api/availability?candidateid=${candidateId}&interviewerid=${interviewerIdsString}`
      );
  
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Showing compatible availabilities');
      const availabilities = response.body.data;
     // expect(availabilities).toHaveLength(expect.any(Number));
       console.log(availabilities)
    // Verificar manualmente se os dados correspondem às interseções corretas
    expect(areTimeIntervalsIntersecting(availabilities[0].startDateTime, availabilities[0].endDateTime, '2090-08-30T08:00:00Z', '2090-08-30T09:00:00Z')).toBe(true);
    expect(areTimeIntervalsIntersecting(availabilities[1].startDateTime, availabilities[1].endDateTime, '2090-09-20T17:00:00Z', '2090-09-20T20:00:00Z')).toBe(true);

    });

    test('Deverá indicar que não houve disponibilidades compativeis pelo candidato não existir', async () => {
      let interviewerIdsString = interviewerIds.join(',')
      const response = await request(app).get(
        `/api/availability?candidateid=${9999}&interviewerid=${interviewerIdsString}`)
        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("There was no compatible availabilities")
    })

    test('Deverá indicar que não houve disponibilidades compativeis pelo horário', async () => {
      const response = await request(app).get(
        `/api/availability?candidateid=${candidateId}&interviewerid=${interviewerIds[2]}`)
        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("There was no compatible availabilities")
    })
  
    // ...
  });
  
