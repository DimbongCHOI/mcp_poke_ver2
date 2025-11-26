import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, MessageCircle, Heart, Zap, ArrowRight } from 'lucide-react'
import { usePokemonStore } from '../store/pokemonStore'
import PokemonCard from '../components/PokemonCard'
import { useQuery } from 'react-query'
import { pokemonAPI } from '../services/api'

const Home = () => {
  const { favorites, searchHistory } = usePokemonStore()
  const [featuredPokemon, setFeaturedPokemon] = useState([])

  // Fetch featured Pokemon (first 20)
  const { data: pokemonList, isLoading } = useQuery(
    'featured-pokemon',
    () => pokemonAPI.getPokemonList(0, 20),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  const quickActions = [
    {
      icon: Search,
      title: '포켓몬 검색',
      description: '이름, 타입, 능력치로 포켓몬을 찾아보세요',
      path: '/search',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: MessageCircle,
      title: 'AI 어시스턴트',
      description: '자연어로 포켓몬에 대해 질문해보세요',
      path: '/chat',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Heart,
      title: '즐겨찾기',
      description: '내가 좋아하는 포켓몬들을 모아보세요',
      path: '/favorites',
      color: 'from-pink-500 to-pink-600',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6">
              Pokedex Assistant
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              AI가 도와주는 스마트한 포켓몬 도감
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>포켓몬 검색하기</span>
              </Link>
              <Link
                to="/chat"
                className="btn-secondary text-lg px-8 py-3 inline-flex items-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>AI와 대화하기</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl font-bold text-center mb-12"
          >
            빠른 시작
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={action.path}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Link
                    to={action.path}
                    className="block p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{action.title}</h3>
                    <p className="text-gray-600 mb-4">{action.description}</p>
                    <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                      <span>시작하기</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Pokemon */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-between mb-12"
          >
            <h2 className="text-3xl font-bold">인기 포켓몬</h2>
            <Link
              to="/search"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2"
            >
              <span>모두 보기</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="pokemon-card p-6 animate-pulse">
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pokemonList?.slice(0, 8).map((pokemon, index) => (
                <motion.div
                  key={pokemon.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <PokemonCard pokemon={pokemon} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Favorites Preview */}
      {favorites.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center justify-between mb-12"
            >
              <h2 className="text-3xl font-bold">내 즐겨찾기</h2>
              <Link
                to="/favorites"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2"
              >
                <span>모두 보기</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {favorites.slice(0, 4).map((pokemon, index) => (
                <motion.div
                  key={pokemon.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                >
                  <PokemonCard pokemon={pokemon} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
