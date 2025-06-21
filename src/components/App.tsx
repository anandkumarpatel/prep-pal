import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from 'components/Layout'
import OrdersPage from 'pages/Orders'
import MenuItemsPage from 'pages/MenuItems'
import IngredientsPage from 'pages/Ingredients'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/orders" />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="menu-items" element={<MenuItemsPage />} />
        <Route path="ingredients" element={<IngredientsPage />} />
      </Route>
    </Routes>
  )
}

export default App
