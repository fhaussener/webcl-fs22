import { ObservableList }           from "../observable/observable.js";
import { Attribute, VALID, VALUE }  from "../presentationModel/presentationModel.js";
import { todoItemProjector }        from "./todoProjector.js";
import { Scheduler }                from "../dataflow/dataflow.js";
import { fortuneService }           from "./fortuneService.js";

export { 
    TodoController,
    TodoItemsView, 
    TodoTotalView, 
    TodoOpenView, 
    TodoClosedView,
    TodoOpenRatioView,
    TodoClosedRatioView,
    ProgressVizView
}

const TodoController = () => {

    const Todo = () => {                               // facade
        const textAttr = Attribute("text");
        const doneAttr = Attribute(false);

        textAttr.setConverter( input => input.toUpperCase() );
        textAttr.setValidator( input => input.length >= 3   );

        // business rules / constraints (the text is only editable if not done)
        doneAttr.getObs(VALUE).onChange( isDone => textAttr.getObs("EDITABLE",!isDone).setValue(!isDone));

        return {
            getDone:            doneAttr.getObs(VALUE).getValue,
            setDone:            doneAttr.getObs(VALUE).setValue,
            onDoneChanged:      doneAttr.getObs(VALUE).onChange,
            getText:            textAttr.getObs(VALUE).getValue,
            setText:            textAttr.setConvertedValue,
            onTextChanged:      textAttr.getObs(VALUE).onChange,
            onTextValidChanged: textAttr.getObs(VALID).onChange,
            onTextEditableChanged: textAttr.getObs("EDITABLE").onChange,
        }
    };

    const todoModel = ObservableList([]); // observable array of Todos, this state is private
    const scheduler = Scheduler();

    const addTodo = () => {
        const newTodo = Todo();
        todoModel.add(newTodo);
        return newTodo;
    };

    const addFortuneTodo = () => {
        const newTodo = Todo();
        todoModel.add(newTodo);
        newTodo.setText('...');
        scheduler.add( ok =>
           fortuneService( text => {
                   newTodo.setText(text);
                   ok();
               }
           )
        );
    };

    const numberOfTodos            = todoModel.count;
    const numberOfOpenTasks        = () =>
          todoModel.countIf( todo => !todo.getDone() );
    const numberOfClosedTasks      = () =>
          todoModel.countIf( todo => todo.getDone() );
    const openTasksRatio           = () =>
          0 === numberOfTodos()
          ? undefined
          : numberOfOpenTasks() / numberOfTodos()
    const closedTasksRatio         = () =>
          0 === numberOfTodos()
          ? undefined
          : numberOfClosedTasks() / numberOfTodos()
    const removeTodo               = todoModel.del;
    const onTodoAdd                = todoModel.onAdd;
    const onTodoRemove             = todoModel.onDel;
    const removeTodoRemoveListener = todoModel.removeDeleteListener; // only for the test case, not used below


    return {
        numberOfTodos,
        numberOfOpenTasks,
        numberOfClosedTasks,
        openTasksRatio,
        closedTasksRatio,
        addTodo,
        addFortuneTodo,
        removeTodo,
        onTodoAdd,
        onTodoRemove,
        removeTodoRemoveListener
    }
};


// View-specific parts

const TodoItemsView = (todoController, rootElement) => {

    const render = todo =>
        todoItemProjector(todoController, rootElement, todo);

    // binding
    todoController.onTodoAdd(render);

    // we do not expose anything as the view is totally passive.
};

const TodoTotalView = (todoController, numberOfTasksElement) => {

    const render = () =>
        numberOfTasksElement.innerText = "" + todoController.numberOfTodos();

    // binding
    todoController.onTodoAdd(render);
    todoController.onTodoRemove(render);
};

const TodoOpenView = (todoController, numberOfOpenTasksElement) => {

    const render = () =>
        numberOfOpenTasksElement.innerText = "" + todoController.numberOfOpenTasks();

    setupBinding(todoController, render);
};

const TodoOpenRatioView = (todoController, openRatioElement) => {
    const render = () =>
        openRatioElement.innerText = `${ratioToPercentage(todoController.openTasksRatio())}%`;

    setupBinding(todoController, render);
};


const TodoClosedView = (todoController, openRatioElement) => {
    const render = () =>
        openRatioElement.innerText = "" + todoController.numberOfClosedTasks();

    setupBinding(todoController, render);
};


const TodoClosedRatioView = (todoController, closedRatioElement) => {    
    const render = () => closedRatioElement.innerText =  `${ratioToPercentage(todoController.closedTasksRatio())}%`;

    setupBinding(todoController, render);
};


const ProgressVizView = (todoController, progressVizEl) => {    
    const render = () => {
        const openEl   = progressVizEl.children[0]; 
        const closedEl = progressVizEl.children[1]; 

        const openPercentage   = ratioToPercentage(todoController.openTasksRatio());
        const closedPercentage = ratioToPercentage(todoController.closedTasksRatio());
    
        openPercentage   > 0 ? openEl.innerText   = `Open: ${openPercentage}%`    : openEl.innerText   = ""; 
        closedPercentage > 0 ? closedEl.innerText = `Closed: ${closedPercentage}%`: closedEl.innerText = ""; 

        openEl.style.width   = `${openPercentage}%`
        closedEl.style.width = `${closedPercentage}%`
    }

    setupBinding(todoController, render);
};

const setupBinding = (todoController, renderFunc) =>{
    todoController.onTodoAdd(todo => {
        renderFunc();
        todo.onDoneChanged(renderFunc);
    });
    todoController.onTodoRemove(renderFunc);
}

const ratioToPercentage = (ratio) => Math.round(ratio * 100).toFixed(0);
