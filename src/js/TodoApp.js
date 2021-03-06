import React, { Component } from 'react';
import FlipMove from 'react-flip-move';
import cookie from 'react-cookie'
import classNames from 'classnames';
import TodoList from './component/TodoList';
import FloatButton from './component/FloatButton';
import '../css/todo.css';

class TodoApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists : [
        { 
          title: 'Welcome',
          todos: [
            { value: '☝︎ Add new item', done: false, editing: false },
            { value: '☜ Mark completed', done: true, editing: false },
            { value: 'Double click to edit', done: false, editing: true },
            { value: 'Delete by clicking ☞', done: false, editing: false },
          ],
          inputText: '',
          titleDone: true,
          nowShowing: 'all',
        },
        { 
          title: 'School',
          todos: [
            { value: 'Midterm', done: false, editing: false },
            { value: 'Web Programming HW1', done: true, editing: false },
          ],
          inputText: '',
          titleDone: true,
          nowShowing: 'all',
        },
      ],
      nowShowing: 'all',
    };
  }

  handleAddClick = () => {
    const lists = this.state.lists;

    lists.push({
      title: 'New list',
      todos: [],
      inputText: '',
      titleDone: false,
      nowShowing: 'all',
    });

    this.setState({ lists });
  }

  handleClearAllClick = () => {
    const lists = this.state.lists;

    lists.forEach((list) => {
      let todos = list.todos;
      todos = todos.filter((t) => !t.done);
      list.todos = todos;
      return list;
    });

    this.setState({ lists });
  }

  handleTitleChange = (title, idx) => {
    const lists = this.state.lists;
    lists[idx].title = title;
    this.setState({ lists })
  }

  handleTitleEditState = (state, idx) => {
    const lists = this.state.lists;
    lists[idx].titleDone = state;
    this.setState({ lists })
  }

  handleInputChange = (text, idx) => {
    const lists = this.state.lists;
    lists[idx].inputText = text;
    this.setState({ lists })
  }

  handleTodosChange = (todos, idx) => {
    const lists = this.state.lists;
    lists[idx].todos = todos;
    this.setState({ lists })
  }

  handelCloseTodo = (idx) => {
    let lists = this.state.lists;
    lists.splice(idx, 1);
    this.setState({ lists });
  }

  handleFilterChange = (type, idx) => {
    let lists= this.state.lists;
    lists[idx].nowShowing = type;
    this.setState({ lists });
  }

  handleAllClick = () => {
    let lists= this.state.lists;
    lists.forEach((list, index) => {
      list.nowShowing = 'all';
    })
    this.setState({ 
      lists,
      nowShowing: 'all',
    });
  }

  handleCompletedClick = () => {
    let lists= this.state.lists;
    lists.forEach((list, index) => {
      list.nowShowing = 'completed';
    })
    this.setState({ 
      lists,
      nowShowing: 'completed',
    });
  }

  handleActiveClick = () => {
    let lists= this.state.lists;
    lists.forEach((list, index) => {
      list.nowShowing = 'active';
    })
    this.setState({ 
      lists,
      nowShowing: 'active',
    });
  }

  renderTodoList = (list, idx) => {
    return (
      <TodoList
        title={ list.title }
        todos={ list.todos }
        inputText={ list.inputText }
        titleDone={ list.titleDone }
        nowShowing={ list.nowShowing }
        key={ `todo-list-${idx}` }
        listIdx={ idx }
        onTitleChange={ (title) => this.handleTitleChange(title, idx) }
        onTitleSubmit={ (state) => this.handleTitleEditState(state, idx) }
        onInputChange={ (text) => this.handleInputChange(text, idx) }
        onTodosChange={ (todos) => this.handleTodosChange(todos, idx) }
        onCloseTodo={ this.handelCloseTodo }
        onFilterChange={ (type) => this.handleFilterChange(type, idx) }
      />
    );
  }

  saveCookie = (d) => {
    const date = new Date();
    const days = d || 365;

    date.setTime(+ date + (days * 86400000));

    cookie.save('state', this.state, { 
      path: '/',
      expires: date,
    });
  }

  componentWillMount() {
    const cookiesState = cookie.load('state');
    if (cookiesState) this.state = cookiesState;
  }

  componentDidMount() {
    this.saveCookie(24);
  }

  componentDidUpdate() {
    this.saveCookie(24);
  }

  render() {
    let doneCount = 0;
    this.state.lists.forEach((list) => {
      doneCount += list.todos.filter((t) => t.done).length;
    });
    let notDoneCount = 0;
    this.state.lists.forEach((list) => {
      notDoneCount += list.todos.filter((t) => !t.done).length;
    });

    return (
      <div className="todos">

        <h1>TODOS</h1>
        <div className="buttons-left">
          <FloatButton
            className={ classNames( 'clouds-flat-button', 'all-button', {
              selected: this.state.nowShowing === 'all',
            }) }
            value={ `⌘ ${ doneCount + notDoneCount }` }
            onButtonCLick={ this.handleAllClick }
          />
          <FloatButton
            className={ classNames( 'clouds-flat-button', 'done-button', {
              selected: this.state.nowShowing === 'completed',
            }) }
            value={ `✔︎ ${ doneCount }` }
            onButtonCLick={ this.handleCompletedClick }
          />
          <FloatButton
            className={ classNames( 'clouds-flat-button', 'not-done-button', {
              selected: this.state.nowShowing === 'active',
            }) }
            value={ `✖︎ ${ notDoneCount }` }
            onButtonCLick={ this.handleActiveClick }
          />
        </div>
        <div className="buttons-right">
          <FloatButton
            className="clouds-flat-button add-list"
            value="+"
            onButtonCLick={ this.handleAddClick }
          />
          <FloatButton
            className="clouds-flat-button clear-all"
            value="⊘"
            onButtonCLick={ this.handleClearAllClick }
          />
        </div>

        <ul className="todo-lists-ul">
          <FlipMove
            className="todo-lists"
            duration={400}
            staggerDelayBy={80}
            easing="ease-out"
            appearAnimation="elevator">
            { this.state.lists.map((list, idx) => this.renderTodoList(list, idx)) }
          </FlipMove>
        </ul>

      </div>
    );
  }
}

export default TodoApp;
