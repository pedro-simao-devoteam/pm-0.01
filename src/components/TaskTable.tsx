import React from 'react';
import { ChevronDown, ChevronRight, Plus, ExternalLink } from 'lucide-react';
import type { TaskList, Task, Priority, Status } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TaskTableProps {
  lists: TaskList[];
  onToggleList: (listId: string) => void;
  onAddTask: (listId: string) => void;
  onAddList: () => void;
  onUpdateTask: (listId: string, taskId: string, updates: Partial<Task>) => void;
  onUpdateListName: (listId: string, name: string) => void;
}

const priorities: Priority[] = ['Low', 'Normal', 'High', 'Critical'];
const statuses: Status[] = [
  'On Hold',
  'To Do',
  'In Progress',
  'Done',
  'To Estimate',
  'Pending Approval',
  'Ready to Test',
];

const priorityColors: Record<Priority, string> = {
  Low: 'bg-gray-100 text-gray-600',
  Normal: 'bg-blue-100 text-blue-600',
  High: 'bg-orange-100 text-orange-600',
  Critical: 'bg-red-100 text-red-600',
};

const statusColors: Record<Status, string> = {
  'On Hold': 'bg-gray-200 text-gray-700',
  'To Do': 'bg-gray-100 text-gray-600',
  'In Progress': 'bg-blue-500 text-white',
  Done: 'bg-green-500 text-white',
  'To Estimate': 'bg-purple-100 text-purple-600',
  'Pending Approval': 'bg-yellow-100 text-yellow-700',
  'Ready to Test': 'bg-cyan-100 text-cyan-700',
};

const TaskTable: React.FC<TaskTableProps> = ({
  lists,
  onToggleList,
  onAddTask,
  onAddList,
  onUpdateTask,
  onUpdateListName,
}) => {
  return (
    <div className="mt-24 px-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Project Tasks</h2>
        <button
          onClick={onAddList}
          className="flex items-center space-x-2 bg-devoteam text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors shadow-sm font-semibold"
        >
          <Plus size={18} />
          <span>New List</span>
        </button>
      </div>

      <div className="space-y-6">
        {lists.map((list) => (
          <div key={list.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* List Header */}
            <div 
              className="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onToggleList(list.id)}
            >
              <div className="mr-2 text-gray-400">
                {list.isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </div>
              <input
                type="text"
                value={list.name}
                onChange={(e) => onUpdateListName(list.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent border-none focus:ring-0 font-bold text-gray-700 text-lg w-full"
              />
              <div className="flex items-center space-x-4 ml-auto">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {list.tasks.length} Tasks
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddTask(list.id);
                  }}
                  className="p-1 hover:bg-gray-200 rounded text-devoteam"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Tasks Table */}
            {list.isExpanded && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      <th className="px-4 py-3 min-w-[300px]">Name</th>
                      <th className="px-4 py-3 min-w-[150px]">Backlog URL</th>
                      <th className="px-4 py-3 min-w-[200px]">Sprint</th>
                      <th className="px-4 py-3 w-32 text-center">Priority</th>
                      <th className="px-4 py-3 w-40 text-center">Status</th>
                      <th className="px-4 py-3 w-28 text-right">Hours</th>
                      <th className="px-4 py-3 w-28 text-right">Estimate</th>
                      <th className="px-4 py-3 w-32 text-right">Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.tasks.map((task) => (
                      <tr key={task.id} className="group hover:bg-gray-50 border-b border-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={task.name}
                            onChange={(e) => onUpdateTask(list.id, task.id, { name: e.target.value })}
                            className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700"
                            placeholder="Task name..."
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={task.backlogUrl}
                              onChange={(e) => onUpdateTask(list.id, task.id, { backlogUrl: e.target.value })}
                              className="w-full bg-transparent border-none focus:ring-0 text-sm text-blue-600 truncate"
                              placeholder="URL or text"
                            />
                            {task.backlogUrl.startsWith('http') && (
                              <a href={task.backlogUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-devoteam">
                                <ExternalLink size={14} />
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <input
                              type="date"
                              value={task.sprint.start}
                              onChange={(e) => onUpdateTask(list.id, task.id, { sprint: { ...task.sprint, start: e.target.value } })}
                              className="bg-transparent border-none p-0 focus:ring-0 w-24"
                            />
                            <span>-</span>
                            <input
                              type="date"
                              value={task.sprint.end}
                              onChange={(e) => onUpdateTask(list.id, task.id, { sprint: { ...task.sprint, end: e.target.value } })}
                              className="bg-transparent border-none p-0 focus:ring-0 w-24"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={task.priority}
                            onChange={(e) => onUpdateTask(list.id, task.id, { priority: e.target.value as Priority })}
                            className={cn(
                              "w-full text-[10px] font-bold uppercase py-1 px-2 rounded-full border-none focus:ring-0 cursor-pointer appearance-none text-center",
                              priorityColors[task.priority]
                            )}
                          >
                            {priorities.map((p) => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <select
                            value={task.status}
                            onChange={(e) => onUpdateTask(list.id, task.id, { status: e.target.value as Status })}
                            className={cn(
                              "w-full text-[10px] font-bold uppercase py-1 px-2 rounded-md border-none focus:ring-0 cursor-pointer appearance-none text-center",
                              statusColors[task.status]
                            )}
                          >
                            {statuses.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <input
                            type="number"
                            value={task.hours || ''}
                            onChange={(e) => onUpdateTask(list.id, task.id, { hours: Number(e.target.value) })}
                            className="w-full bg-transparent border-none focus:ring-0 text-sm text-right font-mono"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm text-gray-600">
                          <input
                            type="number"
                            value={task.estimate || ''}
                            onChange={(e) => onUpdateTask(list.id, task.id, { estimate: Number(e.target.value) })}
                            className="w-full bg-transparent border-none focus:ring-0 text-sm text-right font-mono"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm font-bold text-gray-800">
                          € {task.spent.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {list.tasks.length === 0 && (
                    <tfoot>
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-400 text-sm">
                          No tasks in this list. Click the plus button to add one.
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            )}
          </div>
        ))}

        {lists.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <div className="p-4 bg-gray-50 rounded-full text-gray-400 mb-4">
              <Plus size={48} />
            </div>
            <p className="text-gray-500 font-medium">Create your first task list to get started</p>
            <button
              onClick={onAddList}
              className="mt-4 text-devoteam font-bold hover:underline"
            >
              Add List
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTable;
