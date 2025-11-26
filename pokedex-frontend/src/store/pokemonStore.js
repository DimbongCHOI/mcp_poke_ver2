import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const usePokemonStore = create(
  persist(
    (set, get) => ({
      // State
      pokemonList: [],
      favorites: [],
      searchHistory: [],
      isLoading: false,
      error: null,
      
      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      addToFavorites: (pokemon) => {
        const { favorites } = get()
        if (!favorites.find(fav => fav.id === pokemon.id)) {
          set({ favorites: [...favorites, pokemon] })
        }
      },
      
      removeFromFavorites: (pokemonId) => {
        const { favorites } = get()
        set({ favorites: favorites.filter(fav => fav.id !== pokemonId) })
      },
      
      isFavorite: (pokemonId) => {
        const { favorites } = get()
        return favorites.some(fav => fav.id === pokemonId)
      },
      
      addToSearchHistory: (query) => {
        const { searchHistory } = get()
        const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10)
        set({ searchHistory: newHistory })
      },
      
      clearSearchHistory: () => set({ searchHistory: [] }),
      
      setPokemonList: (pokemonList) => set({ pokemonList }),
      
      // Pokemon type colors mapping
      getTypeColor: (type) => {
        const typeColors = {
          normal: '#A8A878',
          fire: '#F08030',
          water: '#6890F0',
          electric: '#F8D030',
          grass: '#78C850',
          ice: '#98D8D8',
          fighting: '#C03028',
          poison: '#A040A0',
          ground: '#E0C068',
          flying: '#A890F0',
          psychic: '#F85888',
          bug: '#A8B820',
          rock: '#B8A038',
          ghost: '#705898',
          dragon: '#7038F8',
          dark: '#705848',
          steel: '#B8B8D0',
          fairy: '#EE99AC',
        }
        return typeColors[type.toLowerCase()] || '#A8A878'
      },
      
      // Korean type names
      getKoreanTypeName: (englishType) => {
        const typeMap = {
          normal: '노말',
          fire: '불꽃',
          water: '물',
          electric: '전기',
          grass: '풀',
          ice: '얼음',
          fighting: '격투',
          poison: '독',
          ground: '땅',
          flying: '비행',
          psychic: '에스퍼',
          bug: '벌레',
          rock: '바위',
          ghost: '고스트',
          dragon: '드래곤',
          dark: '악',
          steel: '강철',
          fairy: '페어리',
        }
        return typeMap[englishType.toLowerCase()] || englishType
      },
    }),
    {
      name: 'pokemon-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        searchHistory: state.searchHistory,
      }),
    }
  )
)
