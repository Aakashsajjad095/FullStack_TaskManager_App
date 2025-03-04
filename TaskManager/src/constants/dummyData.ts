export const DUMMY_TASKS = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Finish the draft and send it to the team for review by Friday',
    completed: true,
    priority: 'high',
    createdAt: new Date('2024-03-15').toISOString(),
  },
  {
    id: '2',
    title: 'Schedule team meeting',
    description: 'Coordinate with everyone to find a suitable time next week',
    completed: false,
    priority: 'medium',
    createdAt: new Date('2024-03-16').toISOString(),
  },
  {
    id: '3',
    title: 'Update documentation',
    description: 'Review and update the project documentation with recent changes',
    completed: false,
    priority: 'low',
    createdAt: new Date('2024-03-17').toISOString(),
  },
]; 