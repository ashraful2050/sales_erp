<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskComment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $cid   = auth()->user()->company_id;
        $user  = auth()->user();
        $tasks = Task::where('company_id', $cid)
            ->with(['assignedTo:id,name', 'createdBy:id,name'])
            ->withCount('comments')
            ->when($request->status,   fn($q, $s)  => $q->where('status', $s))
            ->when($request->priority, fn($q, $p)  => $q->where('priority', $p))
            ->when($request->assigned_to, fn($q, $u) => $q->where('assigned_to', $u))
            ->when($request->my_tasks, fn($q)       => $q->where('assigned_to', $user->id))
            ->orderBy('due_date')
            ->paginate(20)
            ->withQueryString();

        $users = \App\Models\User::where('company_id', $cid)->select('id', 'name')->get();

        $summary = [
            'total'       => Task::where('company_id', $cid)->count(),
            'pending'     => Task::where('company_id', $cid)->where('status', 'pending')->count(),
            'in_progress' => Task::where('company_id', $cid)->where('status', 'in_progress')->count(),
            'completed'   => Task::where('company_id', $cid)->where('status', 'completed')->count(),
            'overdue'     => Task::where('company_id', $cid)->where('status', '!=', 'completed')->whereNotNull('due_date')->where('due_date', '<', now())->count(),
            'my_tasks'    => Task::where('company_id', $cid)->where('assigned_to', $user->id)->whereNotIn('status', ['completed'])->count(),
        ];

        return Inertia::render('Tasks/Index', [
            'tasks'   => $tasks,
            'users'   => $users,
            'summary' => $summary,
            'filters' => $request->only('status', 'priority', 'assigned_to', 'my_tasks'),
        ]);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'title'        => 'required|max:255',
            'description'  => 'nullable',
            'type'         => 'required|in:general,follow_up,call,meeting,demo',
            'priority'     => 'required|in:low,medium,high,urgent,critical',
            'assigned_to'  => 'nullable|exists:users,id',
            'related_type' => 'nullable|in:lead,customer,invoice',
            'related_id'   => 'nullable|integer',
            'due_date'     => 'nullable|date',
        ]);
        $v['company_id'] = auth()->user()->company_id;
        $v['created_by'] = auth()->id();
        $v['status']     = 'pending';
        Task::create($v);
        return back()->with('success', 'Task created.');
    }

    public function update(Request $request, Task $task)
    {
        abort_if($task->company_id !== auth()->user()->company_id, 403);
        $v = $request->validate([
            'title'       => 'required|max:255',
            'description' => 'nullable',
            'type'        => 'required|in:general,follow_up,call,meeting,demo',
            'status'      => 'required|in:pending,in_progress,completed,cancelled',
            'priority'    => 'required|in:low,medium,high,urgent,critical',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date'    => 'nullable|date',
        ]);
        if ($v['status'] === 'completed' && $task->status !== 'completed') {
            $v['completed_at'] = now();
        }
        $task->update($v);
        return back()->with('success', 'Task updated.');
    }

    public function destroy(Task $task)
    {
        abort_if($task->company_id !== auth()->user()->company_id, 403);
        $task->delete();
        return back()->with('success', 'Task deleted.');
    }

    public function markComplete(Task $task)
    {
        abort_if($task->company_id !== auth()->user()->company_id, 403);
        $task->update(['status' => 'completed', 'completed_at' => now()]);
        return back()->with('success', 'Task marked as complete.');
    }

    public function addComment(Request $request, Task $task)
    {
        abort_if($task->company_id !== auth()->user()->company_id, 403);
        $request->validate(['comment' => 'required|max:1000']);
        $task->comments()->create(['user_id' => auth()->id(), 'comment' => $request->comment]);
        return back()->with('success', 'Comment added.');
    }
}
