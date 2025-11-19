import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Search from './pages/Search'
import Chat from './pages/Chat'
import Favorites from './pages/Favorites'
import PokemonDetail from './pages/PokemonDetail'
import { usePokemonStore } from './store/pokemonStore'

function App() {
  const { isLoading } = usePokemonStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-16"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
        </Routes>
      </motion.main>

      {/* Global Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-600 text-center">포켓몬 데이터를 불러오는 중...</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default App
