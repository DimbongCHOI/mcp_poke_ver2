import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const pokemonAPI = {
  // Get Pokemon list with pagination
  getPokemonList: async (offset = 0, limit = 20) => {
    try {
      const response = await api.get(`/pokemon?offset=${offset}&limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('Pokemon list error:', error.response?.data || error.message)
      throw new Error(`포켓몬 목록을 가져오는데 실패했습니다: ${error.response?.data?.error || error.message}`)
    }
  },

  // Get Pokemon by ID or name
  getPokemon: async (identifier) => {
    try {
      const response = await api.get(`/pokemon/${identifier}`)
      return response.data
    } catch (error) {
      throw new Error(`포켓몬 "${identifier}"을 찾을 수 없습니다.`)
    }
  },

  // Get Pokemon by type
  getPokemonByType: async (type) => {
    try {
      const response = await api.get(`/type/${type}`)
      return response.data
    } catch (error) {
      throw new Error(`타입 "${type}"의 포켓몬을 찾을 수 없습니다.`)
    }
  },

  // Get all Pokemon types
  getPokemonTypes: async () => {
    try {
      const response = await api.get('/types')
      return response.data
    } catch (error) {
      console.error('Pokemon types error:', error.response?.data || error.message)
      throw new Error(`포켓몬 타입 목록을 가져오는데 실패했습니다: ${error.response?.data?.error || error.message}`)
    }
  },

  // Search Pokemon
  searchPokemon: async (query) => {
    try {
      const response = await api.get(`/search?q=${encodeURIComponent(query)}`)
      return response.data
    } catch (error) {
      console.error('Pokemon search error:', error.response?.data || error.message)
      throw new Error(`포켓몬 검색에 실패했습니다: ${error.response?.data?.error || error.message}`)
    }
  },

  // Get Pokemon stats
  getPokemonStats: async (identifier) => {
    try {
      const response = await api.get(`/pokemon/${identifier}/stats`)
      return response.data
    } catch (error) {
      throw new Error(`포켓몬 "${identifier}"의 능력치를 가져오는데 실패했습니다.`)
    }
  },
}

export const chatAPI = {
  // Send message to AI assistant
  sendMessage: async (message) => {
    try {
      const response = await api.post('/chat', { message })
      return response.data
    } catch (error) {
      throw new Error('AI 어시스턴트와의 통신에 실패했습니다.')
    }
  },

  // Get chat history
  getChatHistory: async () => {
    try {
      const response = await api.get('/chat/history')
      return response.data
    } catch (error) {
      throw new Error('채팅 기록을 가져오는데 실패했습니다.')
    }
  },

  // Clear chat history
  clearChatHistory: async () => {
    try {
      const response = await api.delete('/chat/history')
      return response.data
    } catch (error) {
      throw new Error('채팅 기록을 삭제하는데 실패했습니다.')
    }
  },
}

export default api
