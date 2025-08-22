import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ThreeScene from './components/ThreeScene'
import Terminal from './components/Terminal'
import styles from './styles/App.module.css'

const Home = () => {
  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.content}>
        <div className={styles.left_panel}>
          <ThreeScene />
        </div>
        <div className={styles.right_panel}>
          <Terminal />
        </div>
      </div>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App