import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Trash2, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePokemonStore } from '../store/pokemonStore'
import PokemonCard from '../components/PokemonCard'

const Favorites = () => {
  const { favorites, removeFromFavorites, clearFavorites } = usePokemonStore()

  const handleRemoveAll = () => {
    if (window.confirm('모든 즐겨찾기를 삭제하시겠습니까?')) {
      clearFavorites()
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">즐겨찾기</h1>
          </div>
          <p className="text-gray-600 text-lg">
            내가 좋아하는 포켓몬들을 모아보세요
          </p>
        </motion.div>

        {/* Actions */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="text-lg font-semibold text-gray-700">
              총 {favorites.length}마리의 포켓몬
            </div>
            <div className="flex space-x-3">
              <Link
                to="/search"
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>더 찾아보기</span>
              </Link>
              <button
                onClick={handleRemoveAll}
                className="btn-secondary text-red-600 hover:text-red-700 hover:bg-red-50 inline-flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>모두 삭제</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {favorites.map((pokemon, index) => (
              <motion.div
                key={pokemon.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <PokemonCard pokemon={pokemon} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="text-8xl mb-6">💝</div>
            <h3 className="text-2xl font-semibold mb-4">아직 즐겨찾기가 없습니다</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              포켓몬을 검색하고 하트 버튼을 눌러 즐겨찾기에 추가해보세요!
            </p>
            <Link
              to="/search"
              className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-3"
            >
              <Search className="w-5 h-5" />
              <span>포켓몬 검색하기</span>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Favorites
