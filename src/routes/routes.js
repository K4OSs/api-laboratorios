//Importando o objeto Router
const labRouter = require('express').Router()

//Imports dos middlewares
const confereHorario = require('../middlewares/horarioPermitido.js')

//Anexando o middleware para todas as rotas
//labRouter.use(confereHorario)

//Dados mockados, para simular um banco de dados
var laboratorios = [
  { nome: 'lab1', capacidade: '30', descricao: 'Laboratorio de Química'},
  { nome: 'lab2', capacidade: '20', descricao: 'Laboratorio de Informática'},
  { nome: 'lab3', capacidade: '25', descricao: 'Laboratorio de Biologia'},
  { nome: 'lab4', capacidade: '25', descricao: 'Laboratorio de Matemática'},
  { nome: 'lab5', capacidade: '25', descricao: 'Laboratorio de Artes'},
  { nome: 'lab6', capacidade: '20', descricao: 'Segundo Laboratorio de Matemática'},
]

//Esta rota lista todos os labóratorios cadastrados no banco de dados
labRouter.get('/laboratorio/todos', (req, res) => {
  try {
    res.json(laboratorios)
  } catch (error){
    res.json({erro: true, mensagem: 'Não foi possivel recuperar os dados.'})
  }
})

//Rota para cadastrar um novo laboratório
labRouter.post('/laboratorio/novo', (req,res) => {
    try {
        const novoLaboratorio = {
            nome: req.body.nome, 
            capacidade: req.body.capacidade,
            descricao: req.body.descricao
        }
        laboratorios.push(novoLaboratorio)
        res.json({mensagem: 'Laboratório cadastrado com sucesso'})
    } catch (error) {
        res.json({mensagem: 'Erro durante o cadastro'})
    }
})

//Rota para alterar um laboratorio
labRouter.put('/laboratorio', (req, res) => {
    try {
        laboratorios.forEach( (objetoAtual) => {
            if (objetoAtual.nome === req.body.nome) {
                objetoAtual.capacidade = req.body.capacidade
                objetoAtual.descricao = req.body.descricao
            }
        })
        res.json({mensagem: 'lab atualizado com sucesso'})
    } catch (error) {
        res.json({mensagem: 'Erro durante a atualização', erro: true})
    }
})

//Rota para excluir um laboratorio
labRouter.delete('/laboratorio', (req, res) => {
    try {
        laboratorios = laboratorios.filter( (objetoAtual) => {
            return (objetoAtual.nome !== req.body.nome)
        });
        res.json({mensagem: 'lab excluído com sucesso'})
    } catch (error) {
        res.json({mensagem: 'Erro durante a exclusão', erro: true})
    }
})

//Esta rota gera um arquivo PDF para download, com uma lista contendo todos os laboratórios cadastrados
labRouter.get('/laboratorio/relatorio', async (req, res) => {
  const pdfkit = require('pdfkit');

  try {
      const pdfBuffer = await new Promise((resolve, reject) => {
          const pdf = new pdfkit();
          const chunks = [];

          pdf.text('Relatório de Laboratórios\n\n');

          laboratorios.forEach((laboratorio) => {
              pdf.text(`Nome do laboratório: ${laboratorio.nome}`);
              pdf.text(`Capacidade: ${laboratorio.capacidade}`);
              pdf.text(`Descrição: ${laboratorio.descricao}`);
              pdf.moveDown();
          });

          pdf.on('data', (chunk) => {
              chunks.push(chunk);
          });

          pdf.on('end', () => {
              resolve(Buffer.concat(chunks));
          });

          pdf.end();
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="relatorio.pdf"');
      res.send(pdfBuffer);
  } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao gerar o relatório.');
  }
});



module.exports = labRouter