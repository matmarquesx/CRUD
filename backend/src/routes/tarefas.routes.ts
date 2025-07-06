import { Router } from 'express';

const router = Router();

// Example: Get all tarefas
router.get('/', (req, res) => {
    // Logic to fetch tarefas from database
    res.json({ message: 'List of tarefas' });
});

// Example: Create a new tarefa
router.post('/', (req, res) => {
    // Logic to create a new tarefa
    res.status(201).json({ message: 'Tarefa created' });
});

// Example: Get a single tarefa by ID
router.get('/:id', (req, res) => {
    // Logic to fetch a tarefa by ID
    res.json({ message: `Tarefa with ID ${req.params.id}` });
});

// Example: Update a tarefa by ID
router.put('/:id', (req, res) => {
    // Logic to update a tarefa by ID
    res.json({ message: `Tarefa with ID ${req.params.id} updated` });
});

// Example: Delete a tarefa by ID
router.delete('/:id', (req, res) => {
    // Logic to delete a tarefa by ID
    res.json({ message: `Tarefa with ID ${req.params.id} deleted` });
});

export const tarefasRoutes = router;