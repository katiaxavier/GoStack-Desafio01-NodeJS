const express = require('express')
const server = express()
cont = 0
server.use(express.json())

const projects = [
    { id: "1", title: 'Novo projeto', tasks: [] },
    { id: "2", title: 'Novo projeto1', tasks: [] },
    { id: "3", title: 'Novo projeto2', tasks: [] }
]

server.use((req, res, next) => {
    cont++;
    console.log('Total de Requisições: ', cont)
    next()
})

function checkIdExist(req, res, next) {
    const { id } = req.params
    const project = projects.find(proj => proj.id === id)

    if (!project) {
        return res.status(400).json({ error: `Nenhum projeto cadastrado com id ${id}` })
    }
    return next()
}

function checkIdExistInCreate(req, res, next) {
    const { id } = req.body
    const project = projects.find(proj => proj.id === id)
    
    if (project) {
        return res.status(400).json({ error: `Já existe um projeto com esse ID` })
    }
    return next()
}

server.get('/projects', (req, res) => {
    return res.json(projects)
})

server.post('/projects', checkIdExistInCreate, (req, res) => {
    const project = req.body
    projects.push(project)

    return res.json(projects)
})

server.post('/projects/:id/tasks', checkIdExist, (req, res) => {
    const { id } = req.params
    const { title } = req.body
    const project = projects.find(proj => proj.id === id)

    project.tasks.push(title)

    return res.json(projects)
})

server.put('/projects/:id', checkIdExist, (req, res) => {
    const { id } = req.params
    const { title } = req.body
    const project = projects.find(proj => proj.id === id)

    project.title = title

    return res.json(project)
})

server.delete('/projects/:id', checkIdExist, (req, res) => {
    const { id } = req.params
    const project = projects.find(proj => proj.id === id)
    const i = projects.indexOf(project)

    projects.splice(i, 1)

    return res.send()
})

server.listen(3000)