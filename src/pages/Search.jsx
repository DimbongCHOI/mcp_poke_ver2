import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search as SearchIcon, Filter, X } from 'lucide-react'
import { usePokemonStore } from '../store/pokemonStore'
import PokemonCard from '../components/PokemonCard'
import { useQuery } from 'react-query'
import { pokemonAPI } from '../services/api'

const Search = () => {
  const [inputValue, setInputValue] = useState('') // 입력 중인 값
  const [searchQuery, setSearchQuery] = useState('') // 실제 검색 쿼리
  const [selectedType, setSelectedType] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const { addToSearchHistory, searchHistory } = usePokemonStore()

  // 컴포넌트 마운트 확인
  const [isMounted, setIsMounted] = useState(false)
  
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fetch Pokemon types for filter
  const { data: types } = useQuery(
    'pokemon-types',
    pokemonAPI.getPokemonTypes,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  )

  // Search Pokemon
  const { data: searchResults, isLoading: isSearching, error: searchError } = useQuery(
    ['search-pokemon', searchQuery],
    () => pokemonAPI.searchPokemon(searchQuery),
    {
      enabled: searchQuery.length > 0,
      staleTime: 2 * 60 * 1000, // 2 minutes
      retry: 1,
      onError: (error) => {
        console.error('Search error:', error)
      }
    }
  )

  // Get Pokemon by type
  const { data: typeResults, isLoading: isTypeLoading } = useQuery(
    ['pokemon-by-type', selectedType],
    () => pokemonAPI.getPokemonByType(selectedType),
    {
      enabled: selectedType.length > 0,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  const handleInputChange = (value) => {
    setInputValue(value)
    // 입력 중에도 실시간 검색 유지
    setSearchQuery(value.trim())
  }

  const handleSearch = () => {
    const query = inputValue.trim()
    // 검색 기록은 검색 버튼/엔터 키를 눌렀을 때만 저장
    if (query) {
      addToSearchHistory(query)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setInputValue('')
    setSearchQuery('')
    setSelectedType('')
  }

  const results = searchQuery ? searchResults : typeResults
  const isLoading = searchQuery ? isSearching : isTypeLoading

  // 컴포넌트가 마운트되지 않았으면 로딩 표시
  if (!isMounted) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">페이지를 불러오는 중...</p>
        </div>
      </div>
    )
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
          <h1 className="text-4xl font-bold gradient-text mb-4">
            포켓몬 검색
          </h1>
          <p className="text-gray-600 text-lg">
            이름, 타입, 능력치로 원하는 포켓몬을 찾아보세요
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="포켓몬 이름을 입력하세요 (예: 피카츄, Pikachu)"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="input-field pl-12 pr-12 text-lg"
              />
              {inputValue && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={!inputValue.trim()}
              className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              검색
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>타입 필터</span>
          </button>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-white rounded-lg shadow-lg"
            >
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedType('')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedType === ''
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  전체
                </button>
                {types?.map((type) => (
                  <button
                    key={type.name}
                    onClick={() => setSelectedType(type.name)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedType === type.name
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {type.koreanName}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Search History */}
        {searchHistory.length > 0 && !searchQuery && !selectedType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <h3 className="text-lg font-semibold mb-4">최근 검색</h3>
            <div className="flex flex-wrap gap-2">
              {searchHistory.slice(0, 5).map((query) => (
                <button
                  key={query}
                  onClick={() => {
                    setInputValue(query)
                    setSearchQuery(query)
                    // 최근 검색 클릭 시에는 검색 기록에 추가하지 않음 (이미 기록에 있음)
                  }}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {searchError ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold mb-2">검색 중 오류가 발생했습니다</h3>
              <p className="text-gray-600 mb-4">
                {searchError.message}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                페이지 새로고침
              </button>
            </div>
          ) : isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="pokemon-card p-6 animate-pulse">
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : results && results.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold">
                  {searchQuery ? `"${searchQuery}" 검색 결과` : `${selectedType} 타입 포켓몬`}
                  <span className="text-lg font-normal text-gray-600 ml-2">
                    ({results.length}마리)
                  </span>
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.map((pokemon, index) => (
                  <motion.div
                    key={pokemon.id || pokemon.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <PokemonCard pokemon={pokemon} />
                  </motion.div>
                ))}
              </div>
            </>
          ) : (searchQuery || selectedType) && !isLoading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? `"${searchQuery}"에 해당하는 포켓몬을 찾을 수 없습니다.`
                  : `${selectedType} 타입의 포켓몬을 찾을 수 없습니다.`
                }
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold mb-2">포켓몬을 검색해보세요</h3>
              <p className="text-gray-600">
                위의 검색창에 포켓몬 이름을 입력하거나 타입 필터를 사용해보세요.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Search
