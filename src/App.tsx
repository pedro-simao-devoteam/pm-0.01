import { useState, useEffect, useMemo } from 'react';
import type { Project, TaskList, Task } from './types';
import Dashboard from './components/Dashboard';
import TaskTable from './components/TaskTable';

const STORAGE_KEY = 'devoteam-project-management';

const initialProject: Project = {
  name: 'DEVOTEAM Project',
  credits: 10000,
  hourlyRate: 50,
  lists: [
    {
      id: '1',
      name: 'January',
      isExpanded: true,
      tasks: [
        {
          id: '101',
          name: 'Project Setup',
          backlogUrl: 'https://jira.com/task-1',
          sprint: { start: '2025-01-01', end: '2025-01-15' },
          priority: 'High',
          status: 'Done',
          hours: 10,
          estimate: 12,
          spent: 500,
        },
      ],
    },
  ],
};

function App() {
  const [project, setProject] = useState<Project>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialProject;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }, [project]);

  // Recalculate spent for all tasks when hourlyRate or hours change
  const updatedLists = useMemo(() => {
    return project.lists.map(list => ({
      ...list,
      tasks: list.tasks.map(task => ({
        ...task,
        spent: task.hours * project.hourlyRate
      }))
    }));
  }, [project.lists, project.hourlyRate]);

  const consumed = useMemo(() => {
    return updatedLists.reduce((acc, list) => {
      return acc + list.tasks
        .filter(task => task.status !== 'On Hold')
        .reduce((sum, task) => sum + task.spent, 0);
    }, 0);
  }, [updatedLists]);

  const remaining = project.credits - consumed;

  const handleCreditsChange = (credits: number) => {
    setProject(prev => ({ ...prev, credits }));
  };

  const handleHourlyRateChange = (hourlyRate: number) => {
    setProject(prev => ({ ...prev, hourlyRate }));
  };

  const handleToggleList = (listId: string) => {
    setProject(prev => ({
      ...prev,
      lists: prev.lists.map(l => l.id === listId ? { ...l, isExpanded: !l.isExpanded } : l)
    }));
  };

  const handleAddList = () => {
    const newList: TaskList = {
      id: crypto.randomUUID(),
      name: 'New List',
      isExpanded: true,
      tasks: []
    };
    setProject(prev => ({ ...prev, lists: [...prev.lists, newList] }));
  };

  const handleUpdateListName = (listId: string, name: string) => {
    setProject(prev => ({
      ...prev,
      lists: prev.lists.map(l => l.id === listId ? { ...l, name } : l)
    }));
  };

  const handleAddTask = (listId: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      name: '',
      backlogUrl: '',
      sprint: { start: '', end: '' },
      priority: 'Normal',
      status: 'To Do',
      hours: 0,
      estimate: 0,
      spent: 0
    };
    setProject(prev => ({
      ...prev,
      lists: prev.lists.map(l => l.id === listId ? { ...l, tasks: [...l.tasks, newTask] } : l)
    }));
  };

  const handleUpdateTask = (listId: string, taskId: string, updates: Partial<Task>) => {
    setProject(prev => ({
      ...prev,
      lists: prev.lists.map(l => {
        if (l.id !== listId) return l;
        return {
          ...l,
          tasks: l.tasks.map(t => {
            if (t.id !== taskId) return t;
            const updatedTask = { ...t, ...updates };
            // Recalculate spent if hours changed
            if ('hours' in updates) {
              updatedTask.spent = (updates.hours || 0) * prev.hourlyRate;
            }
            return updatedTask;
          })
        };
      })
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard
        credits={project.credits}
        consumed={consumed}
        remaining={remaining}
        hourlyRate={project.hourlyRate}
        onCreditsChange={handleCreditsChange}
        onHourlyRateChange={handleHourlyRateChange}
      />
      <main>
        <TaskTable
          lists={updatedLists}
          onToggleList={handleToggleList}
          onAddTask={handleAddTask}
          onAddList={handleAddList}
          onUpdateTask={handleUpdateTask}
          onUpdateListName={handleUpdateListName}
        />
      </main>
    </div>
  );
}

export default App;
