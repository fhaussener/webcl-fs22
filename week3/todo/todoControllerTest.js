import { TodoController, TodoItemsView, TodoTotalView, TodoOpenView}  from "./todo.js"
import { Suite }                from "../test/test.js";

const todoCtrlSuite = Suite("todoCtrl");

todoCtrlSuite.add("todo-ctrl", assert => {


    const todoController = TodoController();

    assert.is(todoController.numberOfTodos(),     0);
    assert.is(todoController.numberOfopenTasks(), 0);
    assert.is(todoController.openTasksRatio(),    undefined);

    todoController.addTodo();
    assert.is(todoController.numberOfTodos(),     1);
    assert.is(todoController.numberOfopenTasks(), 1);
    assert.is(todoController.openTasksRatio(),    1); // 100%



    todoController.addTodo();

});

todoCtrlSuite.run();
