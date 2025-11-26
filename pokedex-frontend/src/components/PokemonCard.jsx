import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ExternalLink } from 'lucide-react'
import { usePokemonStore } from '../store/pokemonStore'

const PokemonCard = ({ pokemon }) => {
  const { 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite, 
    getTypeColor, 
    getKoreanTypeName 
  } = usePokemonStore()

  const favorite = isFavorite(pokemon.id)

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (favorite) {
      removeFromFavorites(pokemon.id)
    } else {
      addToFavorites(pokemon)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="pokemon-card overflow-hidden group"
    >
      <Link to={`/pokemon/${pokemon.id}`} className="block">
        {/* Pokemon Image */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-gray-500">
              #{pokemon.id.toString().padStart(3, '0')}
            </span>
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full transition-all duration-200 ${
                favorite
                  ? 'text-red-500 bg-red-50 hover:bg-red-100'
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
            </button>
          </div>
          
          <div className="flex justify-center">
            <motion.img
              src={pokemon.sprite}
              alt={pokemon.koreanName}
              className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-300"
              whileHover={{ rotate: 5 }}
              onError={(e) => {
                e.target.src = '/pokeball-placeholder.png'
              }}
            />
          </div>
        </div>

        {/* Pokemon Info */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-1">
            {pokemon.koreanName}
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            {pokemon.name}
          </p>

          {/* Types */}
          <div className="flex flex-wrap gap-2 mb-3">
            {pokemon.types.map((type) => (
              <span
                key={type.name}
                className="pokemon-type text-xs px-2 py-1 rounded-full text-white font-medium"
                style={{ backgroundColor: getTypeColor(type.name) }}
              >
                {getKoreanTypeName(type.name)}
              </span>
            ))}
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            {pokemon.stats.slice(0, 3).map((stat) => {
              const statNames = {
                hp: 'HP',
                attack: '공격',
                defense: '방어',
                'special-attack': '특공',
                'special-defense': '특방',
                speed: '스피드'
              }
              
              return (
                <div key={stat.name} className="text-center">
                  <div className="text-gray-500">{statNames[stat.name] || stat.name}</div>
                  <div className="font-bold text-gray-900">{stat.baseStat}</div>
                </div>
              )
            })}
          </div>

          {/* View Details Link */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-blue-600 group-hover:text-blue-700">
              <span>자세히 보기</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default PokemonCard
