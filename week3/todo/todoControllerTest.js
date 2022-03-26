import { TodoController, TodoItemsView, TodoTotalView, TodoOpenView}  from "./todo.js"
import { Suite }                from "../test/test.js";

const todoCtrlSuite = Suite("todoCtrl");

todoCtrlSuite.add("todo-ctrl", assert => {

    const todoController = TodoController();

    assert.is(todoController.numberOfTodos(),       0);
    assert.is(todoController.numberOfOpenTasks(),   0);
    assert.is(todoController.numberOfClosedTasks(), 0);
    assert.is(todoController.openTasksRatio(),      undefined);
    assert.is(todoController.closedTasksRatio(),    undefined);

    // Plus 1 Todo
    const openTodo = todoController.addTodo();

    assert.is(todoController.numberOfTodos(),       1);
    assert.is(todoController.numberOfOpenTasks(),   1);
    assert.is(todoController.numberOfClosedTasks(), 0);
    assert.is(todoController.openTasksRatio(),      1); // 100%
    assert.is(todoController.closedTasksRatio(),    0); // 0%


    //Plus 1 Todo und auf done setzten
    const closedTodo = todoController.addTodo();
    closedTodo.setDone(true);

    assert.is(todoController.numberOfTodos(),       2);
    assert.is(todoController.numberOfOpenTasks(),   1);
    assert.is(todoController.numberOfClosedTasks(), 1);
    assert.is(todoController.openTasksRatio(),      0.5); // 50%
    assert.is(todoController.closedTasksRatio(),    0.5); // 50%


    //Minus 1 open Todo
    todoController.removeTodo(openTodo);

    assert.is(todoController.numberOfTodos(),       1);
    assert.is(todoController.numberOfOpenTasks(),   0);
    assert.is(todoController.numberOfClosedTasks(), 1);
    assert.is(todoController.openTasksRatio(),      0); // 0%
    assert.is(todoController.closedTasksRatio(),    1); // 100%

    
    //Minus 1 closed Todo
    todoController.removeTodo(closedTodo);

    assert.is(todoController.numberOfTodos(),       0);
    assert.is(todoController.numberOfOpenTasks(),   0);
    assert.is(todoController.numberOfClosedTasks(), 0);
    assert.is(todoController.openTasksRatio(),      undefined); // 0%
    assert.is(todoController.closedTasksRatio(),    undefined); // 0%
});

todoCtrlSuite.run();
