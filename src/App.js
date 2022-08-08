import React, { useState } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  useWatch,
  set,
} from "react-hook-form";
import ReactDOM from "react-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
let renderCount = 0;

function App() {
  const [drag, setDrag] = useState(false);
  const { register, control, handleSubmit, reset, watch, setValue, getValues } =
    useForm({
      defaultValues: {
        test: [{ text: "type contents here ...", id: 0 }],
      },
    });
  const { fields, append, prepend, remove, swap, move, insert, replace } =
    useFieldArray({
      control,
      name: "test",
    });

  const onSubmit = (data) => console.log("data", data);

  // if you want to control your fields with watch
  // const watchResult = watch("test");
  // console.log(watchResult);

  // The following is useWatch example
  // console.log(useWatch({ name: "test", control }));

  renderCount++;

  const onDragEnd = (result) => {
    setDrag(true);
    console.log(result);
    if (!result.destination) return;
    // const value = getValues();
    const items = getValues();
    console.log(items);
    const [recorderData] = items.test.splice(result.source.index, 1);
    items.test.splice(result.destination.index, 0, recorderData);
    items.test.id = result.destination.index;
    setDrag(false);
    console.log(items);
    setValue("test", [...items.test]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <span className="counter">Render Count: {renderCount}</span>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(droppableProvided, droppableSnapshot) => (
            <div ref={droppableProvided.innerRef}>
              <ol>
                {fields.map((item, index) => {
                  // console.log(fields);
                  return (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(draggableProvided, draggableSnapshot) => (
                        <li
                          key={item.id}
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                        >
                          <input {...register(`test.${index}.text`)} />
                          {index < fields.length - 1 && (
                            <button type="button" onClick={() => remove(index)}>
                              Delete
                            </button>
                          )}
                          {index === fields.length - 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                append({
                                  text: "",
                                  id: fields.indexOf(item) + 1,
                                });
                              }}
                            >
                              append
                            </button>
                          )}
                        </li>
                      )}
                    </Draggable>
                  );
                })}
              </ol>
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <section></section>

      <input type="submit" />
    </form>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
export default App;
