import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Fib from './Fib';
import Page2 from './Page2';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to='/'>Home</Link>
          <Link to='/page2'>Page2</Link>
        </header>

        <Route exact path="/" component={Fib} />
        <Route path="/page2" component={Page2} />
      </div>
    </Router>
  );
}

export default App;
