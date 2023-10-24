import  {BrowserRouter, Routes, Route} from 'react-router-dom';
import ShowProduct from './components/ShowProducts';
function App() {
  return (
    //Creamos la ruta de los components
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ShowProduct></ShowProduct>}> </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
