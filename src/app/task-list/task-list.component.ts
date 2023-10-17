import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, NonNullableFormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Observable, of, map, startWith } from 'rxjs';

interface Task {
  id: number,
  title: string,
  isDone: boolean
}

interface TaskForm {
  id: FormControl<number>,
  title: FormControl<string>,
  isDone: FormControl<boolean>
}

@Component({
  selector: 'app---task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent {

  todayTasks: Task[] = [
    { title: 'Do something 0', id: 0, isDone: false } as Task,
    { title: 'Do something 1', id: 1, isDone: false } as Task,
    { title: 'Do something 2', id: 2, isDone: false } as Task,
    { title: 'Do something 3', id: 3, isDone: true } as Task,
  ];
  todayTasksForm = this.fb.group(
    {
      ongoingTasks: this.fb.array(this.todayTasks.filter(t => !t.isDone).map(task => this.fb.group(task))),
      doneTasks: this.fb.array(this.todayTasks.filter(t => t.isDone).map(task => {
        let group = this.fb.group(task) as FormGroup<TaskForm>;
        group.controls.title.disable();
        return group;
      })),
    }
  );
  get ongoingTasks() { return this.todayTasksForm.controls.ongoingTasks as FormArray<FormGroup>; }
  get doneTasks() { return this.todayTasksForm.controls.doneTasks as FormArray<FormGroup>; }

  ongoingOrder = new Map();
  doneOrder = new Map();

  constructor(private readonly fb: NonNullableFormBuilder) { }

  moveToDone(index: number) {
    let movingTask = this.ongoingTasks.controls.splice(index, 1)[0] as FormGroup<TaskForm>;
    movingTask.controls.isDone.setValue(true);
    movingTask.controls.title.disable();

    this.doneTasks.push(movingTask);
  }

  moveToOngoing(index: number) {
    let movingTask = this.doneTasks.controls.splice(index, 1)[0] as FormGroup<TaskForm>;
    movingTask.controls.isDone.setValue(false);
    movingTask.controls.title.enable();

    this.ongoingTasks.push(movingTask);
  }
}
