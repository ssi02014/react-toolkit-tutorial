# 💻 Redux-toolkit-Tutorial

## 🏃‍♂️ Start

- yarn create react-app (프로젝트 이름) --template redux
- yarn add @reduxjs/toolkit redux-devtools-extension
- yarn add @types/react-redux //타입스크립트

<br />

## 👨‍💻 configureStore

- Redux Toolkit에는 Redux 코드를 단순화하는데 도움이 되는 몇 가지 기능 중 첫 번재가 `configureStore`이다.
- 일반적으로 createStore()를 호출하고 root reducer 함수를 전달하여 redux store를 구성한다.
- Redux Toolkit은 createStor()를 래핑한 configureStore() 함수를 제공하고 이 함수는 기본적으로 createStore()과 동일한 기능을 제공한다. 하지만 configureStore()는 store를 생성하는 단계에서 몇 가지 유용한 개발 도구가 설정되도록 한다.
- configureStore()는 여러 개의 인자 대신 이름이 지정된 하나의 object를 인자로 받으므로, reducer 함수를 reducer라는 이름으로 전달해야 한다.

```ts
// Before:
const store = createStore(counter);

// After:
const store = configureStore({
  reducer: counter,
});

// Example
const reducer = {
    ...contractsReducer,
    (...)
}

const rootReducer = combineReducers(reducer);
export const  persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: (...),
      },
    })
      .prepend()
      // prepend and concat calls can be chained
      .concat(middlewares),
  devTools: process.env.NODE_ENV !== "production",
});
```

<br />

## 👨‍💻 createAction

- createAction은 액션 타입 문자열을 인자로 받고, 해당 타입을 사용하는 액션 생성자함수를 반환한다.

```js
// Before: 액션 type과 생성함수를 모두 작성
const INCREMENT = "INCREMENT";

function incrementOriginal() {
  return { type: INCREMENT };
}

console.log(incrementOriginal()); // {type: "INCREMENT"}

// After: createAction 사용
const incrementNew = createAction("INCREMENT");

console.log(incrementNew()); // {type: "INCREMENT"}
```

- createAction을 사용하여 counter 예제 단순화

```js
const increment = createAction("INCREMENT");
const decrement = createAction("DECREMENT");

function counter(state = 0, action) {
  switch (action.type) {
    case increment.type:
      return state + 1;
    case decrement.type:
      return state - 1;
    default:
      return state;
  }
}
```

<br />

## 👨‍💻 createReducer

- if문과 반복문을 포함하여 reducer에서 원하는 조건 논리를 사용할 수 있지만, 가장 일반적인 방법은 action.type 필드를 확인하고 각 유형에 대해 적절한 로직을 수행하는 것이다.
- reducer는 초기 상태값을 제공하고, 현재 액션과 관계없는 상태는 그대로 반환한다.
- Redux Toolkit에는 `lookup Table` 객체를 사용하여 reducer를 작성할 수 있는 createReducer()가 있다.
- createReducer() 객체의 각 키는 redux의 액션 type 문자열이며 값은 reducer함수이다.
- 액션 type 문자열을 키로 사용해야 하므로 `ES6 object computer 속성` 구문을 사용하여 type문자열 변수로 키를 작성할 수 있다.
- computed 속성 구문은 내부에 있는 모든 변수에 대해 `toString()`을 호출하므로 `.type`필드없이 직접 액션 생성자 함수를 사용할 수 있습니다.

```js
const increment = createAction("INCREMENT");
const decrement = createAction("DECREMENT");

const counter = createReducer(0, {
  [increment]: (state) => state + 1,
  [decrement]: (state) => state - 1,
});
```

<br />

## 👨‍💻 createSlice

- 위에 내용으로도 나쁘지 않지만, createSlice로 더 큰 변화를 줄 수 있다.
- createSlice 함수는 객체에 reducer 함수들을 제공할 수 있고 이를 기반으로 액션 타입 문자열과 액션 생성자 함수를 자동으로 생성한다.
- createSlice는 생성된 reducer 함수를 reducer라는 필드를 포함하는 `slice`객체와 `actions`라는 객체 내부에서 생성된 액션 생성함수를 반환한다.

```js
const counterSlice = createSlice({
  name: "counter",
  initialState: 0,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
  },
});

const store = configureStore({
  reducer: counterSlice.reducer,
});
```

- 대부분의 경우, ES6 딕스트럭처링 구문을 이용하여 액션 생성자 함수와 reducer를 변수로 사용하기를 원한다.

```js
export const { increment, decrement } = counterSlice.actions;
```

<br />
<hr />

## 👨‍💻 createSlice(중급)

- createSlice 옵션
  - name: 생성 된 action types를 생성하기 위해 사용되는 prefix
  - initialState: reducer의 초기 상태
  - reducers: key는 action type 문자열이 되고 함수는 해당 액션이 dispatch될 때 실행될 reducer이다.
- 예로, `todos/addTodo`액션이 dispatch될 때 addTodo Reducer가 수행된다.
- createSlice와 createReducer는 `immer library`의 `produce`로 래핑한다. 이것은 이 함수를 사용하는 개발자는 리듀서 내부의 상태를 `변형하는` 코드를 작성할 수 있으며, immer는 상태를 안전하게 불변하게 다룰 수 있도록 처리해준다.(즉, push 같은 메서드 사용 가능)

<br />

- createSclie는 다음과 같은 객체를 반환한다.

```
  {
  name: "todos",
  reducer: (state, action) => newState,
  actions: {
    addTodo: (payload) => ({type: "todos/addTodo", payload}),
    toggleTodo: (payload) => ({type: "todos/toggleTodo", payload})
  },
  caseReducers: {
    addTodo: (state, action) => newState,
    toggleTodo: (state, action) => newState,
  }
}
```

- 각 리듀서마다 적절한 action 생성자와 action type을 자동으로 생성하므로 직접 작성하지 않아도 된다.

<br />

## 👨‍💻 createAsyncThunk

- `createAsyncThunk`를 선언하게 되면 첫 번째 파라미터로 선언한 액션 이름에 pending, fulfilled, rejected의 상태에 대한 action을 자동으로 생성해주게 된다.
- AbortController를 지원하기 때문에 thunk를 사용하여도 api에 대한 취소 작업이 가능하다.

```js
const fetchTodo = createAsyncThunk(
  `todo/fetchTodo`, // 액션 이름을 정의해 주도록 합니다.
  async (todoId, thunkAPI) => {
    // 비동기 호출 함수를 정의합니다.
    const response = await todoApi.fetchTodoInfo(todoId);
    return response.data;
  }
);

// fetchTodo.pending => todo/fetchTodo/pending
// fetchTodo.fulfilled  => todo/fetchTodo/fulfilled
// fetchTodo.rejected  => todo/fetchTodo/rejected
```

<br />
