import {Routes, Route} from 'react-router-dom';
import {routes} from './routes';

export default function App() {
  return <>
      <Routes>
          <Route> 
              {
                routes().map((route, index) => <Route key={index} {...route} />)
              } 
          </Route>
      </Routes>
  </>;
}