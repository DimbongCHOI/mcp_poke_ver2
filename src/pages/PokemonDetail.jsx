import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Share2, BarChart3 } from 'lucide-react'
import { usePokemonStore } from '../store/pokemonStore'
import { useQuery } from 'react-query'
import { pokemonAPI } from '../services/api'
import toast from 'react-hot-toast'

const PokemonDetail = () => {
  const { id } = useParams()
  const { 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite, 
    getTypeColor, 
    getKoreanTypeName 
  } = usePokemonStore()

  const { data: pokemon, isLoading, error } = useQuery(
    ['pokemon', id],
    () => pokemonAPI.getPokemon(id),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  const favorite = pokemon ? isFavorite(pokemon.id) : false

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFromFavorites(pokemon.id)
      toast.success('즐겨찾기에서 제거되었습니다')
    } else {
      addToFavorites(pokemon)
      toast.success('즐겨찾기에 추가되었습니다')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${pokemon.koreanName} - Pokedex Assistant`,
          text: `${pokemon.koreanName}에 대한 정보를 확인해보세요!`,
          url: window.location.href,
        })
      } catch (error) {
        // Share cancelled
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('링크가 복사되었습니다')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-200 rounded-2xl h-96"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-bold mb-4">포켓몬을 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-8">
            요청하신 포켓몬 정보를 불러올 수 없습니다.
          </p>
          <Link to="/search" className="btn-primary">
            다른 포켓몬 검색하기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/search"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>검색으로 돌아가기</span>
          </Link>
        </motion.div>

        {/* Pokemon Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Image Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <span className="text-2xl font-bold text-gray-500">
                #{pokemon.id.toString().padStart(3, '0')}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleFavoriteClick}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    favorite
                      ? 'text-red-500 bg-red-50 hover:bg-red-100'
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${favorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="text-center mb-6">
              <motion.img
                src={pokemon.sprite}
                alt={pokemon.koreanName}
                className="w-48 h-48 mx-auto object-contain"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  e.target.src = '/pokeball-placeholder.png'
                }}
              />
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {pokemon.koreanName}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {pokemon.name}
              </p>

              {/* Types */}
              <div className="flex justify-center space-x-2 mb-6">
                {pokemon.types.map((type) => (
                  <span
                    key={type.name}
                    className="pokemon-type px-4 py-2 rounded-full text-white font-medium"
                    style={{ backgroundColor: getTypeColor(type.name) }}
                  >
                    {getKoreanTypeName(type.name)}
                  </span>
                ))}
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500">키</div>
                  <div className="font-semibold">{pokemon.height}m</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500">몸무게</div>
                  <div className="font-semibold">{pokemon.weight}kg</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="space-y-6">
            {/* Abilities */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>특성</span>
              </h3>
              <div className="space-y-2">
                {pokemon.abilities.map((ability, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{ability.name}</span>
                    {ability.isHidden && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        숨겨진 특성
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">능력치</h3>
              <div className="space-y-4">
                {pokemon.stats.map((stat) => {
                  const statNames = {
                    hp: 'HP',
                    attack: '공격',
                    defense: '방어',
                    'special-attack': '특수공격',
                    'special-defense': '특수방어',
                    speed: '스피드'
                  }
                  
                  const percentage = Math.floor((stat.baseStat / 255) * 100)
                  const barColor = percentage > 80 ? 'bg-green-500' : 
                                 percentage > 60 ? 'bg-yellow-500' : 
                                 percentage > 40 ? 'bg-orange-500' : 'bg-red-500'
                  
                  return (
                    <div key={stat.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {statNames[stat.name] || stat.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          {stat.baseStat} / 255
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`h-3 rounded-full ${barColor}`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PokemonDetail
